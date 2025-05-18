'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiRespone"


function page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  const router = useRouter();

  // zod implemnation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if(debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/checkUsernameUnique?username=${debouncedUsername}`);
          console.log("Respone of axios: ", response)
          setUsername(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error in checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUniqueUsername();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      console.log("Data in onSubmit function: ", data);
      const response = await axios.post<ApiResponse>('/api/signUp', data);
      toast("Success", {
        description: response.data.message,
      })

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error while signup of user: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error("Signup failed",{
        description: errorMessage,
        duration: 3000,
      })
      setIsSubmitting(false);
    }
  } 

  return (
    <div>
        sign in
    </div>
  )
}

export default page

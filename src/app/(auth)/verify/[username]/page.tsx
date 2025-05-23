'use client'

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiRespone';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import * as z from 'zod';

const verifyAccount = () => {
    const router = useRouter();
    const pramas = useParams<{username: string}>();

    // zod implemnation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>("/api/verifyCode", {
                username: pramas.username,
                code: data.code
            });

            toast("Success", {
                description: response.data.message
            })

            router.replace(`/signIn`)
        } catch (error) {
            console.log("Error while verify the code: ", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast.error("Verifing failed", {
              description: errorMessage,
              duration: 3000,
            });
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full shadow-md rounded-b-lg p-8 space-y-8 max-w-md">
            <div className="text-center">
                <h1 className="mb-6 text-6xl">Verify your account</h1>
                <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="Code" {...field} />
                        </FormControl> 
                        <FormMessage />
                        </FormItem>
                        )}
                        />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default verifyAccount

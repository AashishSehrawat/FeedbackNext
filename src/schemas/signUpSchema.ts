import { z } from "zod";

// zod library is used to validate the schema that are described in frontend like siognup feilds
export const usernameSchema= z
    .string()
    .min(2, "Username must be greater than 2 characters")
    .max(20, "Username must not be greater then 20 charcters")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid, username contains the special characters");

export const signUpSchema = z.object({
    username: usernameSchema,
    email: z.string().email({message: "Invalid email"}),
    password: z.string().min(6, {message: "Password must be atleast 6 charcters"})
})




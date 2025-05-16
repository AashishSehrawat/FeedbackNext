import { z } from "zod";

export const signInSchema = z.object({
    // indentifier is also kown as email or username
    identifier: z.string(),
    password: z.string(),
})
import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Atleast 10 character is required" })
    .max(300, { message: "Content must be no longer 300 character" }),
});

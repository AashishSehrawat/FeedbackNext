import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiRespone";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: number,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Feedback verification code',
        react: VerificationEmail({username, otp: verifyCode}),
        });
        return {
            success: true,
            message: "Verification email send successfully",
        }
    } catch (error) {
        console.log("Error in sendVerificationEmail", error );
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}



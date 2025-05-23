import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await req.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        // if user is existed and verified by username 
        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is alredy existed"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        if(existingUserByEmail) {
            // user is existing by email
            if(existingUserByEmail.isVerified) {
                return Response.json({
                success: false,
                message: "Username is alredy existed with this email"
                }, {status: 400})
            } else {
                // user is existoed and not verified
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }
        } else {
            // uswer is not existed
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: [],
            });
            await newUser.save();
        }

        console.log("Attempting to send verification email to:", email); 
        // send the verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Error in email response"
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: "User register successful. please verify your email"
        }, {status: 200})

    } catch (error) {
        console.log("Error in registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}





import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { z } from "zod";
import { usernameSchema } from '@/schemas/signUpSchema';

const UsernameQuerrySchema = z.object({
    username: usernameSchema
})

export async function GET(request: Request) {

    await dbConnect();
     
    try {
        const { searchParams } = new URL(request.url);
        const queryparam = {
            username: searchParams.get('username')
        }

        // validate woth zod
        const result = UsernameQuerrySchema.safeParse(queryparam);
        console.log("Result: ", result);

        if(!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameError.length>0 ? usernameError.join(',') : "Error in usernaem validation",
                }, {status: 400}
            )
        }

        const { username } = result.data;

        const existingVerifedUser = await UserModel.findOne({ username, isVerified: true});
        if(existingVerifedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is alredy is occupied"
                }, { status: 400 }
            )
        }

        return Response.json(
                {
                    success: true,
                    message: "Username is unique"
                }, { status: 200 }
            )

    } catch (error) {
        console.log("Error in checking unique username ", error);
        return Response.json(
            {
                success: false,
                message: "Error in checking unique username"
            }, { status: 500 }
        )
    }
}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, code} = await request.json();

        // sometime getting data form url is not get form normal so decodedURLComponent is used
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername})
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 400 })
        }

        const isCodeVaild = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeVaild && isCodeNotExpired) {
            user.isVerified = true
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account is verfied",
                }, {status: 200}
            )
        } else if(!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "verfication Code is expired so sign up",
                }, {status: 400}
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "verfication Code is not correct",
                }, {status: 400}
            )
        }




    } catch (error) {
        console.log("Error in verifying code: ", error);
        return Response.json({
            success: false,
            message: "Error in verfying code"
        }, { status: 500 })
    }
}

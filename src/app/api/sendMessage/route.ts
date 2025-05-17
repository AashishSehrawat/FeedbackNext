import UserModel from "@/model/UserModel";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/UserModel";


export async function POST(request: Request) {
    await dbConnect();

    const {username, content} = await request.json();
    try {
        const user = await UserModel.findOne({username})
        if(!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 400})
        }

        if(!user.isAcceptingMessage) {
                return Response.json({
                success: false,
                message: "user is not accepting the messages"
            }, {status: 400})
        }

        const newMessage = {content, createdAt: new Date()};
        user.message.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message send successfully"
        }, {status: 200})

    } catch (error) {
        console.log("error while sending the message ", error);
        return Response.json({
            success: false,
            message: "error while sending the messages"
        }, {status: 400})
    }
}

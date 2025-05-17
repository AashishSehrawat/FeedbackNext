import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "user is not authenicated"
        }, {status: 400})
    }

    const userId = user._id;
    const { accesptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: accesptMessages},
            {new: true}
        );

        if(!updatedUser) {
            return Response.json({
            success: false,
            message: "fail to update the user"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "message acceptence updated successfully",
            updatedUser,
        }, {status: 200});

    } catch (error) {
        console.log("fail to update the user status to accept message ", error)
        return Response.json({
            success: false,
            message: "fail to update the user status to accept message"
        }, {status: 400})
    }

}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "user is not authenicated"
        }, {status: 400})
    }

    const userId = user._id;

    try {
        const currentUser = await UserModel.findById(userId);
        if(!currentUser) {
            return Response.json({
                success: false,
                message: "failed to found the user"
            }, {status: 400})
        }

        return Response.json({
            success: true, 
            isAcceptingMessage: currentUser.isAcceptingMessage
        }, {status: 200}) 
    } catch (error) {
        console.log("failed to get user isAcceptMessage status ", error)
        return Response.json({
            success: false,
            message: "failed to get user isAcceptMessage status "
        }, {status: 400})
    }
}


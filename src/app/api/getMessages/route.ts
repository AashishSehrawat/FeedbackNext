import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "invalid authnication",
      },
      { status: 400 }
    );
  }

  // we save the user id as string in token and session. In mongodb aggergation pipeline there some problem arise as userId is string not the mongodb ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $unwind: "$message",
      },
      {
        $sort: { "message.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", message: { $push: "$message" } },
      },
    ]);

    if(!user || user.length === 0) {
        return Response.json(
      {
        success: false,
        message: "user not found",
      },
      { status: 400 }
    );
    } 

    return Response.json(
      {
        success: true,
        message: user[0].message,
      },
      { status: 200 }
    );
  } catch (error) {
        console.log("error in getting messages: ", error);
        return Response.json(
      {
        success: false,
        message: "error in getting messages",
      },
      { status: 400 }
    );
  }
}

import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    await connectMongoDB();
    const { comment } = await req.json();
    const { id } = params;

    if (!comment) {
      return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }

    const result = await Ticket.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { comments: comment },
        $set: { status: "Started" }
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "Comment added and status updated to Started" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Failed to add comment" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
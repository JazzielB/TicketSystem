import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    // Ensure MongoDB connection
    await connectMongoDB();
    
    // Parse request body
    const body = await req.json();
    const ticketData = body; // Directly access ticket data

    // Create the ticket
    await Ticket.create(ticketData);
    console.log("Ticket Data:", ticketData); // Log the ticket data

    return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error); // Log the error details
    return NextResponse.json({ message: "Error creating ticket", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Ensure MongoDB connection
    await connectMongoDB();

    // Fetch tickets from the database
    const tickets = await Ticket.find();
    console.log("Fetched Tickets:", tickets); // Log fetched tickets

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error); // Log the error details
    return NextResponse.json({ message: "Error fetching tickets", error: error.message }, { status: 500 });
  }
}

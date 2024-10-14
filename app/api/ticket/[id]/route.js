import Ticket from "@/models/Ticket";
import { NextResponse, nextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const foundTicket = await Ticket.findOne({ _id: id });
    return NextResponse.json({ foundTicket }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await Ticket.findByIdAndDelete(id);

    return NextResponse.json({ message: "Ticket Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json(); // Obtiene todo el cuerpo de la solicitud

    // Aquí se espera que body contenga todos los datos del ticket directamente
    const updateTicketData = await Ticket.findByIdAndUpdate(id, body, {
      new: true, // Retorna el ticket actualizado
      runValidators: true, // Asegúrate de que los validadores del esquema se ejecuten
    });

    if (!updateTicketData) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ticket Updated", ticket: updateTicketData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

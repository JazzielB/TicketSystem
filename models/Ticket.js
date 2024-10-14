import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    status: { type: String, default: "open" },
    active: { type: Boolean, default: true },
    user: { type: String, required: true },
    comments: { type: [String], default: [] }, // Asegúrate de que este campo esté presente
  },
  { timestamps: true }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
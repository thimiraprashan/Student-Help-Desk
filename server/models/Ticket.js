import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: String,
    message: String,
    status: {
      type: String,
      default: "open",
    },
    reply: String,
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
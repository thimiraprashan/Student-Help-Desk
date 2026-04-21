import Ticket from "../models/Ticket.js";

// CREATE TICKET
export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = await Ticket.create({
      subject,
      message,
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET ALL TICKETS
export const getTickets = async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
};
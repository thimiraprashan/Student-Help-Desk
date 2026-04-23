import express from "express";
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "../controllers/contactMessageController.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", getContactMessages);
router.patch("/:id/status", updateContactMessageStatus);
router.delete("/:id", deleteContactMessage);

export default router;

import express from "express";
import { sendMessage, getMessages } from "../Controllers/CSMessageControllers.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/:id1/:id2", getMessages);

export default router;
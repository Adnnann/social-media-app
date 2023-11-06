import express from "express";
import {
  getUserChats,
  postMessage,
  readMessage,
  markMessagesRead,
} from "../controllers/messagesCtrl.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:receiverId/userChats", verifyToken, getUserChats);
router.get("/:senderId/:receiverId/receiveMessage", verifyToken, readMessage);

router.post("/:receiverId/markMessagesRead", verifyToken, markMessagesRead);

router.patch("/:id/:userId/startChat", verifyToken, postMessage);
router.patch("/:id/:userId/sendMessage", verifyToken, postMessage);

export default router;

import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  viewProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:userId/:friendId", verifyToken, addRemoveFriend);
router.put("/:id/:userId", viewProfile);

export default router;

import express from "express";
import {
  getUserFriends,
  addRemoveFriend,
  viewProfile,
  getUsers,
  getUserProfileAndPosts,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:userId", verifyToken, getUserProfileAndPosts);
router.get("/:id/friends", verifyToken, getUserFriends);
router.post("/search/:queryTerm", verifyToken, getUsers);

/* UPDATE */
router.patch("/:friendId/addFriend", verifyToken, addRemoveFriend);
router.put("/:id/:userId", viewProfile);

export default router;

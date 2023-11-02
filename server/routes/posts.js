import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  commentPost,
  deletePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:postId/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);

router.delete("/:postId/deletePost", verifyToken, deletePost);

export default router;

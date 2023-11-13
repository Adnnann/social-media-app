import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  commentPost,
  createPost,
  replyToComment,
  deleteCommentReply,
  likeReplyToComment,
  likeComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* CREATE */
router.post("/createPost", verifyToken, createPost);

/* UPDATE */
router.patch("/likePost", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);

router.patch("/likeComment", verifyToken, likeComment);
router.patch("/replyToComment", verifyToken, replyToComment);
router.patch("/likeReplyToComment", verifyToken, likeReplyToComment);

router.patch("/deleteCommentReply", verifyToken, deleteCommentReply);

export default router;

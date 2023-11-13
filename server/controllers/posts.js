import { jwtDecode } from "jwt-decode";
import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find({});

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = jwtDecode(req.cookies.token).id;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  const { postId, likeId, userId } = req.body;
  const post = await Post.findById(postId);
  const user = await User.findById(userId);

  if (!post) return res.status(404).json({ message: "Post not found" });

  let updatedPost;
  let isLiked = post.likes.filter((like) => like.userId === userId).length > 0;

  if (isLiked) {
    try {
      await Post.findByIdAndUpdate(
        {
          _id: mongoose.Types.ObjectId(postId),
        },
        {
          $pull: {
            likes: {
              userId: userId,
            },
          },
        },
        { new: true }
      );

      updatedPost = await Post.findById(postId);
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  } else {
    try {
      await Post.findByIdAndUpdate(
        {
          _id: mongoose.Types.ObjectId(postId),
        },
        {
          $push: {
            likes: {
              _id: mongoose.Types.ObjectId(),
              userId: userId,
              picturePath: user.picturePath,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          },
        },
        { new: true }
      );
      updatedPost = await Post.findById(postId);
      console.log(updatedPost);
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = jwtDecode(req.cookies.token).id;
    const { comment } = req.body;
    const post = await Post.findById(id);
    const user = await User.findById(userId);

    const newComment = post.comments;

    newComment.push({
      _id: mongoose.Types.ObjectId(),
      userId,
      content: comment,
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: newComment },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  Post.deleteOne({ _id: postId }, async (err) => {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      const posts = await Post.find();
      res.status(200).json({ message: "Post deleted", posts: posts });
    }
  });
};

export const replyToComment = async (req, res) => {
  const { postId, userId, commentReplyContent, commentId } = req.body;
  const user = await User.findById(userId);

  await Post.findOneAndUpdate(
    {
      _id: postId,
      $and: [{ "comments._id": mongoose.Types.ObjectId(commentId) }],
    },

    {
      $push: {
        "comments.$.replies": {
          _id: mongoose.Types.ObjectId(),
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          content: commentReplyContent,
          picturePath: user.picturePath,
        },
      },
    },
    { new: true }
  );

  const updatedPosts = await Post.find({});

  res.status(200).json(updatedPosts);
};

export const likeComment = async (req, res) => {
  const { postId, userId, commentId } = req.body;
  console.log(req.body);

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ message: "Post not found" });

  const isLiked =
    post.comments
      .filter((comment) => comment._id.toString() === commentId)[0]
      .likes.filter((like) => like.userId === userId).length > 0;

  if (isLiked) {
    try {
      await Post.findOneAndUpdate(
        {
          _id: postId,
          $and: [
            {
              "comments._id": mongoose.Types.ObjectId(commentId),
            },
          ],
        },
        {
          $pull: {
            "comments.$.likes": { userId: userId },
          },
        },
        { new: true }
      );

      const post = await Post.findById(postId);

      console.log(post);

      return res.status(200).json(post);
    } catch (err) {
      res.status(404).json();
    }
  } else {
    try {
      await Post.findOneAndUpdate(
        {
          _id: postId,
          $and: [{ "comments._id": mongoose.Types.ObjectId(commentId) }],
        },
        {
          $push: {
            "comments.$.likes": {
              _id: mongoose.Types.ObjectId(),
              userId: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              picturePath: user.picturePath,
            },
          },
        },
        { new: true }
      );

      const post = await Post.findById(postId);

      console.log(post);

      return res.status(200).json(post);
    } catch (err) {
      console.log(err);
      res.status(404).json({ error: err });
    }
  }
};

export const deleteCommentReply = async (req, res) => {
  const { postId, commentId, commentReplyId } = req.body;

  await Post.findOneAndUpdate(
    {
      _id: postId,
      $and: [{ "comments._id": mongoose.Types.ObjectId(commentId) }],
    },

    {
      $pull: {
        "comments.$.replies": {
          _id: mongoose.Types.ObjectId(commentReplyId),
        },
      },
    },
    { new: true }
  );

  const updatedPosts = await Post.findById(postId);
  res.status(200).json(updatedPosts.comments.replies);
};

export const likeReplyToComment = async (req, res) => {
  const { postId, userId, commentId, commentReplyId, commentReplyLikeId } =
    req.body;

  const post = await Post.findById(postId);
  const user = await User.findById(userId);

  if (!post) return res.send.json("Post not found");

  if (commentReplyLikeId) {
    try {
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $pull: {
            "comments.$[comment].replies.$[reply].likes": {
              _id: commentReplyLikeId,
            },
          },
        },
        {
          arrayFilters: [
            { "comment._id": commentId },
            { "reply._id": commentReplyId },
          ],
        }
      );
      const update = await Post.findById(postId);
      return res.status(200).json(update);
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  } else {
    try {
      await Post.findOneAndUpdate(
        {
          _id: postId,

          $and: [
            {
              "comments._id": mongoose.Types.ObjectId(commentId),
              "comment.replies": mongoose.Types.ObjectId(commentReplyId),
            },
          ],
        },
        {
          $push: {
            "comments.$.replies.$[].likes": {
              _id: mongoose.Types.ObjectId(),
              userName: user.firstName,
              lastName: user.lastName,
              picturePath: user.picturePath,
            },
          },
        },
        { new: true }
      );
      const updatedPost = await Post.findById({ _id: postId });
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(404).json(error.message);
    }
  }
};

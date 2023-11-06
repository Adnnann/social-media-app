import { jwtDecode } from "jwt-decode";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
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

/* READ */
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
  try {
    const { postId } = req.body;
    const userId = jwtDecode(req.cookies.token).id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    let isLiked = false;
    const objectLikes = post.likes.filter((item) => typeof item === "object");

    if (post?.likes && post?.likes?.length > 0) {
      console.log("objectLikes", objectLikes);
      isLiked =
        objectLikes.filter((item) => item.userId.toString() === userId).length >
        0
          ? true
          : false;
    }

    const user = await User.findById(userId);

    let likes = post.likes;

    if (isLiked) {
      likes = [
        ...objectLikes.filter((item) => item.userId.toString() !== userId),
      ];
    } else {
      likes.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        picturePath: user.picturePath,
        createdAt: Date.now(),
      });
      console.log(likes);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
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
      // deleted at most one tank document
    } else {
      const posts = await Post.find();
      res.status(200).json({ message: "Post deleted", posts: posts });
    }
  });

  //res.status(200).json(updatedPost);
};

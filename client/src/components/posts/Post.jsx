import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/utils/FlexBetween";
import Friend from "components/users/Friend";
import WidgetWrapper from "components/utils/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentPostMutation,
  deletePostApi,
  likePost,
} from "api/postsMutations";
import LikeCommentButton from "./LikeCommentButton";

import CommentPost from "./CommentPosts";
import CommentAndDeletePosts from "./CommentAndDeleteButtons";

const Post = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);
  const queryClient = useQueryClient();

  const isLiked = Boolean(likes[userId]);
  const likeCount = Object.keys(likes).length;
  const [comment, setComment] = useState("");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [isComments, setIsComments] = useState(false);

  const { mutate: deletePost } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: () => deletePostApi(token, postId),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const { mutate: like } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: () => likePost(token, postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const { mutate: commentPost } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: async () => {
      if (comment.length === 0) return;

      return await commentPostMutation(token, postId, userId, comment);
    },

    onSuccess: (data) => {
      console.log("data", data);
      queryClient.invalidateQueries("posts");
      setComment("");
    },
  });

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const startCommenting = () => {
    setIsComments(!isComments);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:5000/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <CommentAndDeletePosts
            openCommentSection={startCommenting}
            deletePost={() => deletePost(token)}
            userId={userId}
            postUserId={postUserId}
          />
          {postUserId !== userId && (
            <LikeCommentButton
              likeComment={() => like(token)}
              color={isLiked ? primary : main}
              isLiked={isLiked}
              likeCount={likeCount}
            />
          )}
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <CommentPost
          comment={comment}
          handleComment={handleComment}
          commentPost={() => commentPost(token)}
          comments={comments}
          name={name}
          main={main}
        />
      )}
    </WidgetWrapper>
  );
};

export default Post;

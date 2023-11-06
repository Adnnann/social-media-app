import { ShareOutlined, QuestionAnswerOutlined } from "@mui/icons-material";
import { IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/utils/FlexBetween";
import Friend from "components/users/Friend";
import WidgetWrapper from "components/utils/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserId, setChatParams, setMessages } from "state/userReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentPostMutation,
  deletePostApi,
  likePost,
} from "api/postsMutations";
import LikeCommentButton from "./LikeCommentButton";

import CommentPost from "./CommentPosts";
import CommentAndDeletePosts from "./CommentAndDeleteButtons";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "state/authReducer";
import { getPostsApi } from "api/postsQuery";

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
  socket,
  likesCount,
}) => {
  const token = useSelector(getToken);
  const userId = useSelector(getUserId);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    mutationFn: () => likePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const { mutate: commentPost, isSuccess: isSuccessComment } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: async () => {
      if (comment.length === 0) return;
      return await commentPostMutation(postId, userId, comment);
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

  const startChat = async () => {
    dispatch(setChatParams({ receiverId: postUserId, senderId: userId }));

    try {
      const response = await axios.get(
        `/chat/${userId}/${postUserId}/receiveMessage`,
        {
          withCredentials: true,
        }
      );

      if (response.data.length === 0) {
        dispatch(setMessages([]));
        navigate(`/chat/${userId}`);
      } else {
        dispatch(setMessages(response.data));
        navigate(`/chat/${userId}`);
      }

      socket.emit("create-room", `room-${userId}-${postUserId}`);

      socket.emit("join", { userId, postUserId });
    } catch (err) {
      console.log(err);
    }
  };

  let replies = [];
  for (let i = 0; i < 2; i++) {
    replies.push({
      firstName: "John",
      lastName: "Doe",
      content: "Hello",
      picturePath: "p7.jpeg",
    });
  }

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
              likeComment={() => like(postId, userId)}
              color={isLiked ? primary : main}
              isLiked={isLiked}
              likeCount={likeCount}
            />
          )}
          {userId !== postUserId && (
            <IconButton onClick={startChat}>
              <QuestionAnswerOutlined />
            </IconButton>
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
          replies={replies}
          like={like}
        />
      )}
    </WidgetWrapper>
  );
};

export default Post;

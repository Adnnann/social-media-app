import { ShareOutlined, QuestionAnswerOutlined } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
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
import Popup from "components/utils/Popup";
import PopupComponent from "components/utils/Popup";

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
  likeId,
  likeCount,
}) => {
  const token = useSelector(getToken);
  const userId = useSelector(getUserId);
  const queryClient = useQueryClient();
  const friends = useSelector((state) => state.user.friendsIDs);

  console.log("friends", friends);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLiked = Boolean(likes[userId]);
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
    mutationFn: (postId, likeId) => likePost(postId, likeId),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const { mutate: commentPost } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: async () => {
      if (comment.length === 0) return;
      return await commentPostMutation(postId, userId, comment);
    },

    onSuccess: () => {
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

  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);

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
              likeComment={() => like({ postId, likeId, userId })}
              color={isLiked ? primary : main}
              likeCount={likeCount}
              isLiked={isLiked}
              margin={"20px"}
            />
          )}

          {userId !== postUserId && friends.includes(postUserId) ? (
            <IconButton onClick={startChat}>
              <QuestionAnswerOutlined />
            </IconButton>
          ) : null}
        </FlexBetween>

        <IconButton onClick={handleClick}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {open ? <PopupComponent anchor={anchor} /> : null}
      <Typography
        component={"p"}
        sx={{ marginRight: "20px", marginTop: "20px" }}
      >
        Likes
      </Typography>
      <div style={{ display: "flex", marginTop: "10px", marginBottom: "10px" }}>
        <AvatarGroup
          max={20}
          sx={{
            "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 15 },
          }}
          spacing="medium"
        >
          {likes.length > 0
            ? likes.map((item) => {
                return (
                  <Tooltip title={item.firstName + " " + item.lastName}>
                    <Avatar
                      src={`http://localhost:5000/assets/${item.picturePath}`}
                      sx={{ width: 20, height: 20 }}
                    />
                  </Tooltip>
                );
              })
            : null}
        </AvatarGroup>
      </div>
      {isComments && (
        <CommentPost
          comment={comment}
          handleComment={handleComment}
          commentPost={() => commentPost(token)}
          comments={comments}
          name={name}
          main={main}
          like={like}
          postId={postId}
        />
      )}
    </WidgetWrapper>
  );
};

export default Post;

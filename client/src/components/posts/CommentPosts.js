import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeleteOutlineOutlined, ReplyAllOutlined } from "@mui/icons-material";
import LikeCommentButton from "./LikeCommentButton";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommentReplyMutation,
  likeCommentReplyMutation,
  replyToCommentMutation,
  likeCommentMutation,
} from "api/postsMutations";
import { useSelector } from "react-redux";
import { getUserId } from "state/userReducer";

export default function CommentPost({
  comment,
  handleComment,
  commentPost,
  comments,
  name,
  main,
  postId,
}) {
  const [commentReplyContent, setCommentReplyContent] = useState("");
  const queryClient = useQueryClient();
  const [postReply, setPostReply] = useState(
    Array(comments.length).fill(false)
  );
  const [commentRepliesVisibility, setCommentRepliesVisibility] = useState(
    Array(comments.length).fill(false)
  );

  const userId = useSelector(getUserId);

  const { mutateAsync: replyToComment } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: (postId, userId, commentReplyContent, commentId) => {
      return replyToCommentMutation(
        postId,
        userId,
        commentReplyContent,
        commentId
      );
    },
    onSuccess: () => {
      setCommentReplyContent("");
      queryClient.invalidateQueries("posts");
    },
  });

  const changeCommentReplyHandler = (event) => {
    console.log(event.target.value);
    setCommentReplyContent(event.target.value);
  };

  const commentReply = (index) => {
    let newPostReply = [];
    newPostReply = [...postReply];
    newPostReply[index] = !newPostReply[index];
    console.log(newPostReply);

    setPostReply(newPostReply);
    setCommentReplyContent("");
  };

  const showCommentReplies = (index) => {
    const newCommentRepliesVisibility = [...commentRepliesVisibility];
    newCommentRepliesVisibility[index] = !newCommentRepliesVisibility[index];
    setCommentRepliesVisibility(newCommentRepliesVisibility);
  };

  const { mutateAsync: deleteCommentReply } = useMutation({
    mutationKey: "posts",
    invalidatesTags: ["posts"],
    mutationFn: (postId, commentId, commentReplyId) => {
      return deleteCommentReplyMutation(postId, commentId, commentReplyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const { mutate: likeCommentReply } = useMutation({
    mutationKey: "posts",
    invalidateTags: ["posts"],
    mutationFn: (
      postId,
      commentId,
      commentReplyId,
      userId,
      commentReplyLikeId
    ) =>
      likeCommentReplyMutation(
        postId,
        commentId,
        commentReplyId,
        userId,
        commentReplyLikeId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const { mutate: likeComment } = useMutation({
    mutationKey: "posts",
    invalidateTags: ["posts"],
    mutationFn: (postId, commentId, userId, commentLikeId) => {
      return likeCommentMutation(postId, commentId, userId, commentLikeId);
    },
    onSuccess: () => {
      console.log("success");
      return queryClient.invalidateQueries("posts");
    },
  });

  return (
    <Box>
      <TextField
        value={comment}
        placeholder="Add a comment..."
        fullWidth
        onChange={handleComment}
      />
      <div style={{ marginLeft: "auto" }}>
        <Button
          style={{ alignContent: "right", display: "flex" }}
          onClick={commentPost}
        >
          Post comment
        </Button>
      </div>
      {comments.map((comment, i) => (
        <Box key={`${name}-${i}`} style={{ border: "none" }}>
          <Divider />

          <CardHeader
            avatar={
              <Avatar
                alt="Remy Sharp"
                src={`http://localhost:5000/assets/${comment.picturePath}`}
              />
            }
            title={`${comment.firstName} ${comment.lastName}`}
          />

          <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            {comment.content}
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "20px",
            }}
          >
            <LikeCommentButton
              likeComment={() =>
                likeComment({
                  postId,
                  userId,
                  commentId: comment._id,
                  commentLikeId:
                    comment?.likes && comment?.likes[i]?._id
                      ? comment.likes[i]._id
                      : null,
                })
              }
              isLiked={comment?.likes ? true : false}
              likeCount={comment?.likes ? comment.likes.length : 0}
              color={
                comment?.likes && comment.likes.length > 0
                  ? "secondary"
                  : "disabled"
              }
            />
            <IconButton
              style={{ marginLeft: "20px", color: "red" }}
              onClick={() => commentReply(i)}
            >
              <ReplyAllOutlined />
            </IconButton>
          </Box>
          <Typography style={{ color: "GrayText", marginLeft: "20px" }}>
            Likes
          </Typography>
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              marginLeft: "20px",
            }}
          >
            <AvatarGroup
              max={20}
              sx={{
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  fontSize: 15,
                },
              }}
              spacing="medium"
            >
              {comment?.likes && comment.likes.length > 0
                ? comment.likes.map((item) => {
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
          {postReply[i] && (
            <>
              <Box
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <TextField
                  placeholder="Reply..."
                  onChange={changeCommentReplyHandler}
                  value={commentReplyContent}
                  fullWidth
                />
              </Box>

              <div style={{ marginLeft: "auto" }}>
                <Button
                  style={{
                    alignContent: "right",
                    display: "flex",
                    textTransform: "none",
                  }}
                  onClick={() =>
                    replyToComment({
                      postId: postId,
                      userId: userId,
                      commentReplyContent: commentReplyContent,
                      commentId: comment._id,
                    })
                  }
                >
                  Post reply
                </Button>
              </div>
            </>
          )}

          {comment?.replies && comment.replies.length > 0 ? (
            <Button onClick={() => showCommentReplies(i)}>View replies</Button>
          ) : null}
          {comment?.replies &&
          comment.replies.length &&
          commentRepliesVisibility[i] > 0
            ? comment.replies.map((commentReply, i) => (
                <Box
                  key={`${comment.firstName}-${i}`}
                  style={{ paddingLeft: "50px" }}
                >
                  {i === 0 ? null : <Divider style={{ width: "100%" }} />}
                  <CardHeader
                    avatar={
                      <Avatar
                        alt="Remy Sharp"
                        src={`http://localhost:5000/assets/${commentReply.picturePath}`}
                      />
                    }
                    title={`${commentReply.firstName} ${commentReply.lastName}`}
                    style={{ paddingLeft: "0px", marginBottom: "0" }}
                  />

                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    style={{ marginTop: "0" }}
                  >
                    <Grid item>
                      <Typography sx={{ color: main, pl: "1rem" }}>
                        {commentReply.content}
                      </Typography>
                    </Grid>

                    {commentReply.userId !== userId && (
                      <Grid item>
                        <LikeCommentButton
                          likeCount={
                            commentReply?.likes ? commentReply.likes.length : 0
                          }
                          comment={commentReply}
                          isLiked={commentReply?.likes ? true : false}
                          likeComment={() =>
                            likeCommentReply({
                              postId,
                              commentId: comment._id,
                              commentReplyId: commentReply._id,
                              userId,
                              commentReplyLikeId:
                                commentReply?.likes &&
                                commentReply.likes[i]?._id
                                  ? commentReply.likes[i]._id
                                  : null,
                            })
                          }
                        />
                      </Grid>
                    )}

                    {commentReply.userId === userId && (
                      <Grid item>
                        <IconButton
                          style={{ color: "red" }}
                          onClick={() =>
                            deleteCommentReply({
                              postId: postId,
                              commentId: comment._id,
                              commentReplyId: commentReply._id,
                            })
                          }
                        >
                          <DeleteOutlineOutlined fontSize="200px" />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                  <div style={{ display: "flex" }}>
                    <AvatarGroup
                      max={20}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 24,
                          height: 24,
                          fontSize: 15,
                        },
                      }}
                      spacing="medium"
                    >
                      {commentReply?.likes?.length > 0
                        ? commentReply?.likes.map((item) => {
                            return (
                              <Tooltip
                                title={item.firstName + " " + item.lastName}
                              >
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
                </Box>
              ))
            : null}
        </Box>
      ))}

      {comments.length > 2 && <Button>View more comments</Button>}
    </Box>
  );
}

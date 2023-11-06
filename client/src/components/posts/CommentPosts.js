import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorderOutlined,
  FavoriteBorderRounded,
  FavoriteBorderSharp,
  FavoriteBorderTwoTone,
  FavoriteTwoTone,
  ReplyAllOutlined,
} from "@mui/icons-material";
import LikeCommentButton from "./LikeCommentButton";

export default function CommentPost({
  comment,
  handleComment,
  commentPost,
  comments,
  name,
  main,
  replies,
  like,
}) {
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
              likeComment={like}
              isLiked={comment?.likes ? true : false}
              likeCount={comment?.likes ? comment.likes.length : 0}
              color={
                comment?.likes && comment.likes.length > 0
                  ? "secondary"
                  : "disabled"
              }
            />
            <IconButton style={{ marginLeft: "20px", color: "red" }}>
              <ReplyAllOutlined />
            </IconButton>
          </Box>
          <Divider style={{ width: "100%" }} />
          {replies.map((comment, i) => (
            <Box
              key={`${comment.firstName}-${i}`}
              style={{ paddingLeft: "50px" }}
            >
              <Divider style={{ width: "100%" }} />
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
                  likeCount={comment.likes}
                  comment={comment}
                  isLiked={comment?.likes ? true : false}
                />

                <IconButton style={{ marginLeft: "20px", color: "red" }}>
                  <ReplyAllOutlined />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
      <Divider />

      {comments.length > 2 && <Button>View more comments</Button>}
      <Divider />
    </Box>
  );
}

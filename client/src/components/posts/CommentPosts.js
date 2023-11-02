import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ReplyAllOutlined,
} from "@mui/icons-material";
import ReplyIcon from "@mui/icons-material/Reply";

export default function CommentPost({
  comment,
  handleComment,
  commentPost,
  comments,
  name,
  main,
}) {
  return (
    <Box mt="0.5rem">
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
        <Box key={`${name}-${i}`}>
          <Divider />

          <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            <strong>{`${comment.firstName} ${comment.lastName} `}</strong>
            <br />
            {comment.comment}
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "20px",
            }}
          >
            <ButtonGroup orientation="horizontal">
              <IconButton style={{ alignSelf: "center" }}>
                <FavoriteBorderOutlined />
              </IconButton>
              <IconButton style={{ marginLeft: "20px" }}>
                <ReplyAllOutlined />
              </IconButton>
            </ButtonGroup>
          </Box>
        </Box>
      ))}
      {/* <Divider /> */}
      <Button>View more comments</Button>
    </Box>
  );
}

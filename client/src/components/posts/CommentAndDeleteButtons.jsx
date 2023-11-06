import {
  ChatBubbleOutlineOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import FlexBetween from "components/utils/FlexBetween";

export default function CommentAndDeletePosts({
  openCommentSection,
  deletePost,
  userId,
  postUserId,
}) {
  return (
    <>
      <IconButton onClick={openCommentSection}>
        <ChatBubbleOutlineOutlined />
      </IconButton>
      {userId === postUserId && (
        <IconButton onClick={deletePost}>
          <DeleteOutlineOutlined fontSize="medium" />
        </IconButton>
      )}
    </>
  );
}

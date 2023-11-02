import FlexBetween from "components/utils/FlexBetween";
import { IconButton, Typography } from "@mui/material";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
export default function LikeCommentButton({
  likeComment,
  color,
  isLiked,
  likeCount,
}) {
  return (
    <FlexBetween gap="0.3rem">
      <IconButton onClick={likeComment}>
        {isLiked ? (
          <FavoriteOutlined sx={{ color: color }} />
        ) : (
          <FavoriteBorderOutlined />
        )}
      </IconButton>
      <Typography>{likeCount}</Typography>
    </FlexBetween>
  );
}

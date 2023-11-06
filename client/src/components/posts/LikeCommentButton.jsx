import FlexBetween from "components/utils/FlexBetween";
import { Badge, IconButton, Typography } from "@mui/material";
import {
  Favorite,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
export default function LikeCommentButton({
  likeComment,
  isLiked,
  likeCount,
  comment,
  color,
}) {
  return (
    <>
      <IconButton onClick={likeComment}>
        <IconButton
          style={{
            marginLeft: "20px",
          }}
        >
          <Badge badgeContent={likeCount} overlap="rectangular">
            <Favorite
              fontSize="large"
              color={likeCount > 0 ? "secondary" : "disabled"}
            />
          </Badge>
        </IconButton>
      </IconButton>
    </>
  );
}

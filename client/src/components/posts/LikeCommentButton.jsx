import { Avatar, AvatarGroup, Badge, IconButton } from "@mui/material";
import { Favorite } from "@mui/icons-material";
export default function LikeCommentButton({ likeComment, likeCount }) {
  return (
    <>
      <IconButton onClick={likeComment}>
        <Badge badgeContent={likeCount} overlap="rectangular">
          <Favorite
            fontSize="inherit"
            color={likeCount > 0 ? "secondary" : "disabled"}
          />
        </Badge>
      </IconButton>
    </>
  );
}

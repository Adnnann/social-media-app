import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserId, setFriends, setUserData } from "state/userReducer";
import FlexBetween from "../utils/FlexBetween";
import UserImage from "./UserImage";
import { addFriendMutation } from "api/friendsMutations";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "state/authReducer";

const Friend = ({ friendId, name, subtitle, userPicturePath, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(getUserId);
  const friendsIDs = useSelector((state) => state.user.friendIDs);

  let isFriend = friendsIDs.includes(friendId);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const {
    mutate: addFriend,
    isError,
    error,
  } = useMutation({
    mutationKey: "friends",
    invalidatesTags: ["friends"],
    mutationFn: () => addFriendMutation(userId, friendId),

    onSuccess: (data) => {
      dispatch(setUserData(data));
      dispatch(setFriends(data.friends));
    },
  });

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {friendId !== userId && window.location.pathname !== "/messages" ? (
        <IconButton
          onClick={() => addFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      ) : null}
    </FlexBetween>
  );
};

export default Friend;

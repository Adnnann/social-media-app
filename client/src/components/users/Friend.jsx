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

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(getUserId);
  const friends = useSelector((state) => state.user.friends);

  //let friend = friends.filter((friend) => friend._id === friendId);

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
    mutationFn: () => addFriendMutation(friendId),

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
          onClick={() => addFriend(friendId)}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          <PersonAddOutlined sx={{ color: primaryDark }} />
          {/* {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )} */}
        </IconButton>
      ) : null}
    </FlexBetween>
  );
};

export default Friend;

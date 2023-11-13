import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/users/Friend";
import WidgetWrapper from "components/utils/WidgetWrapper";

import { useDispatch, useSelector } from "react-redux";
import { getUserId, setFriends } from "state/userReducer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends } from "api/friendsQuery";
import { getToken } from "state/authReducer";

const FriendList = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const friends = useSelector((state) => state.user.friends);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(userId),
    onSuccess: (data) => {
      console.log(data);
      dispatch(setFriends(data));
    },
  });

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <WidgetWrapper
      style={{
        backgroundColor:
          window.location.pathname === "/messages" ? "#0A0A0A" : "",
      }}
    >
      {window.location.pathname !== "/messages" && (
        <Typography
          color={palette.neutral.dark}
          variant="h5"
          fontWeight="500"
          sx={{ mb: "1.5rem" }}
        >
          Friend List
        </Typography>
      )}
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.length > 0
          ? friends
              .filter(
                (friend) =>
                  friend._id !== userId && friend.acceptedFriendRequest
              )
              .map((friend) => (
                <Friend
                  key={friend._id}
                  id={friend._id}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                />
              ))
          : null}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendList;

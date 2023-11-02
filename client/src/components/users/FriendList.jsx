import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/users/Friend";
import WidgetWrapper from "components/utils/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends } from "api/friendsMutations";

const FriendList = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);

  const {
    data: friends,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(userId, token),
    onSuccess: (data) => {
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
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.length > 0
          ? friends.map((friend) => (
              <Friend
                key={friend._id}
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

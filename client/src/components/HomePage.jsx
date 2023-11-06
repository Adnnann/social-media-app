import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UserWidget from "components/users/User";
import MyPostWidget from "components/posts/MyPost";
import PostsWidget from "components/posts/Posts";
import AdvertWidget from "components/users/Advert";
import FriendListWidget from "components/users/FriendList";
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "api/postsQuery";
import { useEffect } from "react";
import SearchUsers from "./users/SearchUsers";
import { getAllUserChats } from "api/chatMutations";
import { getUserId, setMessages } from "state/userReducer";
import { getToken } from "state/authReducer";

const HomePage = ({ socket }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const userId = useSelector(getUserId);
  const picturePath = useSelector((state) => state.user.picturePath);
  const token = useSelector(getToken);
  const search = useSelector((state) => state.user.search);
  const filteredUsers = useSelector((state) => state.filteredUsers);

  const { firstName, lastName, email } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const params = {
    userId: userId,
    token: token,
  };

  const { data: messages, isSuccess: isSuccessChats } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getAllUserChats(params),
  });

  useEffect(() => {
    socket.emit("login", {
      firstName,
      lastName,
      email,
      userId,
      socketId: socket.id,
    });

    if (!messages) return;
    dispatch(setMessages(messages));

    return () => {
      socket.off("login");
    };
  }, [isSuccessChats, socket]);

  // const {
  //   isSuccess: isSuccessPosts,
  //   isLoading: isLoadingPosts,
  //   isError: isErrorPosts,
  //   data: posts,
  //   error,
  // } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: () => getPostsApi(),
  // });

  return (
    <Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={picturePath} />
        </Box>

        {search ? (
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <SearchUsers users={filteredUsers} />
          </Box>
        ) : (
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <MyPostWidget picturePath={picturePath} />

            <PostsWidget userId={userId} socket={socket} />
          </Box>
        )}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={userId} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;

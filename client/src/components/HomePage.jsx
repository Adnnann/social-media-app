import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "components/core/NavBar";
import UserWidget from "components/users/User";
import MyPostWidget from "components/posts/MyPost";
import PostsWidget from "components/posts/Posts";
import AdvertWidget from "components/users/Advert";
import FriendListWidget from "components/users/FriendList";
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "api/postsQuery";
import { useEffect } from "react";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const {
    isSuccess: isSuccessPosts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    data: posts,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPostsApi(token),
  });

  if (isErrorPosts) {
    return <div>{error.message}</div>;
  }

  if (isLoadingPosts) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget
            userId={_id}
            posts={posts}
            isSuccessPosts={isSuccessPosts}
          />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            {/* <FriendListWidget userId={_id} /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;

import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import FriendList from "components/users/FriendList";
import MyPost from "components/posts/MyPost";
import Posts from "components/posts/Posts";
import User from "components/users/User";

import axios from "axios";
import { viewUserProfile } from "state/userReducer";
import Friend from "./Friend";
import Post from "components/posts/Post";

const ProfilePage = () => {
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const userProfile = useSelector((state) => state.user.viewedUserProfile);
  const userPosts = useSelector((state) => state.user.viewedUserProfilePosts);
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.userProfile);

  const getUserProfileAndPosts = async () => {
    const response = await axios.get(`/users/${userId}`, {
      withCredentials: true,
    });
    const data = await response.data;
    dispatch(viewUserProfile(data));
  };

  useEffect(() => {
    getUserProfileAndPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {userProfile?._id && (
            <User
              userId={userProfile._id}
              picturePath={userProfile.picturePath}
            />
          )}

          <Box m="2rem 0" />

          {userProfile?.friends &&
            userProfile.friends.length > 0 &&
            userProfile.friends.map((friend) => (
              <Friend
                key={friend._id}
                id={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPost picturePath={loggedUser.picturePath} />
          <Box m="2rem 0" />
          {Object.values(userPosts).length > 0
            ? userPosts.map((item) => {
                return (
                  <Post
                    key={item._id}
                    postId={item._id}
                    postUserId={item.userId}
                    name={`${item.firstName} ${item.lastName}`}
                    description={item.description}
                    location={item.location}
                    picturePath={item.picturePath}
                    userPicturePath={item.userPicturePath}
                    likes={item.likes}
                    comments={item.comments}
                    socket={item.socket}
                    likesCount={item.likes.length || 0}
                  />
                );
              })
            : null}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

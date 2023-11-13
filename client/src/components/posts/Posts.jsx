import { getPostsApi } from "api/postsQuery";
import Post from "components/posts/Post";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state/userReducer";
import _ from "lodash";
import { CircularProgress, Grid } from "@mui/material";

const Posts = ({ socket }) => {
  const dispatch = useDispatch();

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error,
    isSuccess: isSuccessPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPostsApi(),
  });

  useEffect(() => {
    dispatch(setPosts(posts));
  }, [isSuccessPosts]);

  if (isLoadingPosts) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2vh",
        }}
      >
        <CircularProgress size="4rem" />
      </div>
    );
  }
  if (isErrorPosts) {
    return <div>{error.message}</div>;
  }

  console.log(posts);

  return (
    <>
      {isSuccessPosts
        ? _.orderBy(posts, ["createdAt"], ["desc"]).map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <Post
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
                socket={socket}
                likeId={likes._id}
                likeCount={likes.length || 0}
              />
            )
          )
        : null}
    </>
  );
};

export default Posts;

import { useSelector } from "react-redux";

import Post from "components/posts/Post";
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "api/postsQuery";

const Posts = ({ posts, isSuccessPosts, isPendingPosts }) => {
  return (
    <>
      {isSuccessPosts
        ? posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(
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
                />
              )
            )
        : null}
    </>
  );
};

export default Posts;

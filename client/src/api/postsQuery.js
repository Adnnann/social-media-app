import axios from "axios";

export const getPostsApi = async (token) => {
  const response = await axios(`/posts`);
  return response.data;
};

export const getUserPosts = async (token, userId) => {
  const response = await axios(`/posts/${userId}/posts`, {
    withCredentials: true,
  });
  return response.data;
};

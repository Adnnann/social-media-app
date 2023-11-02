import axios from "axios";

const API_URL = "http://localhost:5000";

export const getPostsApi = async (token) => {
  const response = await axios(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserPosts = async (token, userId) => {
  const response = await axios(`${API_URL}/posts/${userId}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

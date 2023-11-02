import axios from "axios";
import config from "./apiConfig";

export const createPost = async (data) => {
  const response = await axios.post(
    `${config.baseUrl}/posts/createPost`,
    {
      userId: data.userId,
      description: data.description,
      picturePath: data.picturePath,
    },

    {
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deletePostApi = async (token, postId) => {
  const response = await axios.delete(
    `${config.baseUrl}/posts/${postId}/deletePost`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const likePost = async (token, postId, userId) => {
  const response = await axios.patch(
    `${config.baseUrl}/posts/${postId}/like`,
    { userId: userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const commentPostMutation = async (token, postId, userId, comment) => {
  const response = await axios.patch(
    `${config.baseUrl}/posts/${postId}/comment`,
    { userId: userId, comment: comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

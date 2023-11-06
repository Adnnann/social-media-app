import axios from "axios";

export const createPost = async (data) => {
  const response = await axios.post(
    `/posts/createPost`,
    {
      userId: data.userId,
      description: data.description,
      picturePath: data.picturePath,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deletePostApi = async (token, postId) => {
  const response = await axios.delete(
    `/posts/${postId}/deletePost`,

    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const likePost = async (postId, userId) => {
  const response = await axios.patch(
    `/posts/${postId}/like`,
    { postId: postId, userId: userId },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const commentPostMutation = async (postId, userId, comment) => {
  const response = await axios.patch(
    `/posts/${postId}/comment`,
    { userId: userId, comment: comment },

    {
      withCredentials: true,
    }
  );
  return response.data;
};

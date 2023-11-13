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

export const likePost = async (data) => {
  const response = await axios.patch(
    `/posts/likePost`,
    { ...data },
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

export const likeCommentMutation = async (data) => {
  const response = await axios.patch(
    "/posts/likeComment",
    { ...data },
    { withCredentials: true }
  );
  return response.data;
};

export const replyToCommentMutation = async (data) => {
  const response = await axios.patch(
    "/posts/replyToComment",
    {
      postId: data.postId,
      userId: data.userId,
      commentReplyContent: data.commentReplyContent,
      commentId: data.commentId,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteCommentReplyMutation = async (data) => {
  const response = await axios.patch(
    `/posts/deleteCommentReply`,
    { ...data },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const likeCommentReplyMutation = async (data) => {
  const response = await axios.patch(
    "/posts/likeReplyToComment",
    {
      ...data,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

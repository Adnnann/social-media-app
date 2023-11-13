import axios from "axios";

export const getFriends = async (userId, token) => {
  const response = await axios.get(`/users/${userId}/friends`, {
    withCredentials: true,
  });
  return await response.data;
};

import axios from "axios";

import config from "./apiConfig";

export const addFriendMutation = async (userId, friendId) => {
  const response = await axios.patch(`/users/${userId}/${friendId}`, {
    withCredentials: true,
  });
  return response.data;
};

import axios from "axios";

import config from "./apiConfig";

export const addFriendMutation = async (friendId) => {
  const response = await axios.patch(`/users/${friendId}/addFriend`, {
    withCredentials: true,
  });
  return response.data;
};

import axios from "axios";

import config from "./apiConfig";

export const getFriends = async (token, userId) => {
  const response = await axios.get(
    `http://localhost:5000/users/${userId}/friends`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await response.data;
};

export const addFriendMutation = async (userId, friendId, token) => {
  const response = await axios.patch(
    `${config.baseUrl}/users/${userId}/${friendId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

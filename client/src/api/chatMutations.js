import axios from "axios";
import config from "./apiConfig";

export const getAllUserChats = async (data) => {
  const response = await axios.get(`/chat/${data.userId}/userChats`, {
    withCredentials: true,
  });
  return response.data;
};

export const markMessagesAsRead = async (data) => {
  const response = await axios.post(`/chat/${data.userId}/markMessagesRead`, {
    withCredentials: true,
  });
  return response.data;
};

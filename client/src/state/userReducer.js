import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: null,
  userId: null,
  posts: [],
  socket: [],
  userFullName: null,
  picturePath: null,
  showMessageSenders: false,
  chatParams: {
    senderId: null,
    receiverId: null,
  },
  messages: [],
  search: false,
  filteredUsers: [],
  friends: [],
  friendIDs: [],
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    setUserData: (state, action) => {
      state.userProfile = action.payload;
      state.userId = state.userProfile._id;
      state.picturePath = state.userProfile.picturePath;
      state.userFullName = `${state.userProfile.firstName} ${state.userProfile.lastName}`;
    },
    setLogout: (state) => {
      Object.assign(state, initialState);
    },
    setFriends: (state, action) => {
      console.log("action.payload", action.payload);
      state.friends = action.payload;
      state.friendIDs = action.payload.map((friend) => friend._id);
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setMessageSendersVisibility: (state) => {
      state.showMessageSenders = !state.showMessageSenders;
    },
    setChatParams: (state, action) => {
      state.chatParams = action.payload;
    },
    setMessages: (state, action) => {
      if (action.payload.filter(Boolean).length === 0) {
        return;
      } else {
        state.messages = action.payload;
      }
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
  },
});

export const getUserId = (state) => state.user.userId;
export const getUserProfile = (state) => state.user.userId;
export const getChatParams = (state) => state.user.chatParams;
export const getMessages = (state) => state.user.messages;
export const getUserFullName = (state) => state.user.userFullName;

export const {
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setUserData,
  setSocket,
  setMessageSendersVisibility,
  setMessages,
  setSearch,
  setFilteredUsers,
  setChatParams,
} = userSlice.actions;

export default userSlice.reducer;

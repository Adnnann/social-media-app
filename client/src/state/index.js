import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  friends: [],
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const {
  setMode,
  setToken,
  setUser,
  setFriends,
  setLogout,

  setPosts,
  setPost,
  setUserData,
} = authSlice.actions;
export default authSlice.reducer;

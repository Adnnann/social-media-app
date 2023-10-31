import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  posts: [],
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
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
 
  setPosts,
  setPost,

} = authSlice.actions;
export default authSlice.reducer;

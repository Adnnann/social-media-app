import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setTokenToNull: (state) => {
      Object.assign(state, initialState);
    },
    resetAuthStore: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const getToken = (state) => state.auth.token;

export const { setMode, setToken, setTokenToNull, resetAuthStore } =
  authSlice.actions;
export default authSlice.reducer;

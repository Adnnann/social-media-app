import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../state/authReducer";
import userReducer from "../state/userReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

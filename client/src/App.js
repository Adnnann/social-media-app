import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LoginPage from "components/auth/Login";
import ProfilePage from "components/users/ProfilePage";
import { lazy, useEffect, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { io } from "socket.io-client";
import Navbar from "components/core/NavBar";
import { UserChatMessages } from "components/messages/UserChatMessages";
import UserChats from "components/messages/UserChats";
import {
  getUserId,
  setFriends,
  setMessages,
  setSocket,
  setUserData,
} from "state/userReducer";
import { getToken, setMode, setToken } from "state/authReducer";
import axios from "axios";
import { getAllUserChats } from "api/chatMutations";
import FriendRequests from "components/friends/FriendRequest";

const socket = io("http://localhost:5000");
const HomePage = lazy(() => import("components/HomePage"));

function App() {
  const mode = useSelector((state) => state.auth.mode);
  const theme = createTheme(themeSettings(mode));
  const isAuth = Boolean(useSelector(getToken));
  const userId = useSelector(getUserId);
  const dispatch = useDispatch();
  const [showNavbar, setShowNavbar] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const test = localStorage.getItem("mode");

    console.log(test);

    //dispatch(setMode("light"));

    setSocket(io("http://localhost:5000"));

    axios
      .get("/auth/checkToken")
      .then((res) => {
        dispatch(setToken(res.data.token));
        dispatch(setUserData(res.data.user));
        dispatch(setFriends(res.data.user.friends));
        setSocket(io("http://localhost:5000"));

        setShowNavbar(true);
        getAllUserChats({ userId: res.data.user._id, token: res.data.token })
          .then((res) => {
            console.log(res.data);
            dispatch(setMessages(res.data || []));
          })
          .catch((err) => {
            console.log(err);
          });
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {(window.location.pathname !== "/" && isAuth) || showNavbar ? (
          <Navbar />
        ) : null}
        <CssBaseline />
        <Routes>
          {isAuth ? <Route path="/" element={<Navigate to="/home" />} /> : null}
          <Route path="/" element={<LoginPage socket={socket} />} />
          <Route
            path="/home"
            element={
              isAuth ? (
                <Suspense fallback={<h1>Error. Please try later</h1>}>
                  <HomePage socket={socket} />{" "}
                </Suspense>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile/:userId"
            element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/chat/:receiverId"
            element={
              isAuth ? (
                <UserChatMessages socket={socket} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/userChats" element={<UserChats />} />

          <Route path="/friendRequests" element={<FriendRequests />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    /* 
      <div
        style={{
          color: "gray",
          position: "fixed",
          bottom: 0,
          height: "5%",
          backgroundColor: "#1A1A1A",
          width: "100%",
          textAlign: "center",
          paddingTop: "5px",
        }}
      >
        All rights reserved
      </div> */
  );
}

export default App;

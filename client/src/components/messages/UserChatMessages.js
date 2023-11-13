import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardHeader,
  Grid,
  TextField,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/utils/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { getChatParams, setMessages } from "state/userReducer";

import axios from "axios";

import Avatar from "@mui/material/Avatar";
import { io } from "socket.io-client";

export const UserChatMessages = ({ socket }) => {
  const showMessageSenders = useSelector((state) => state.showMessageSenders);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user._id);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSentStatus] = useState(false);

  const chatParticipants = useSelector(getChatParams);

  const userData = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    if (!socket) {
      io("http://localhost:5000");
      socket.emit("login", {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userId: userData._id,
        socketId: socket.id,
      });
      socket.emit("create-room", {
        senderId: chatParticipants.senderId,
        receiverId: chatParticipants.receiverId,
      });
    }

    socket.on("message-received", () => {
      console.log("message received");
      axios
        .get(
          `http://localhost:5000/chat/${chatParticipants.senderId}/${chatParticipants.receiverId}/receiveMessage`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          dispatch(setMessages(res.data));
          setMessageSentStatus(false);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return () => {
      socket.off("message-received");
      socket.off("message-received");
    };
  }, [socket, message.length, dispatch, messageSent, chatParticipants]);

  const messages = useSelector((state) => state.user.messages);

  const handleMessages = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (message === "") return;

    const messageData = {
      receiverId: chatParticipants.receiverId,
      senderId: chatParticipants.senderId,
      message,
      isRead: false,
    };

    axios
      .patch(
        `/chat/${chatParticipants.receiverId}/${chatParticipants.senderId}/sendMessage`,
        messageData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        dispatch(setMessages(res.data));
        socket.emit("message-sent", {
          senderId: chatParticipants.senderId,
          receiverId: chatParticipants.receiverId,
          socketId: socket.id,
          message: message,
        });
        setMessageSentStatus(true);
      })
      .catch((err) => {
        console.log(err);
      });
    setMessage("");
    //dispatch(setMessages(response.data[0].message));
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent={"center"}
      style={{ paddingTop: "5%", overflow: "hidden", width: "80%" }}
    >
      {showMessageSenders || isNonMobileScreens ? (
        <Grid
          item
          xs={12}
          md={5}
          lg={2}
          xl={2}
          style={{ height: "0px", marginRight: "10%" }}
        >
          {userData?.friends && userData.friends.length > 0
            ? userData.friends.map((user, index) => (
                <CardHeader
                  id={user.picturePath + index}
                  avatar={
                    <Avatar
                      alt="Remy Sharp"
                      src={`http://localhost:5000/assets/${user.picturePath}`}
                    />
                  }
                  title={`${user.firstName} ${user.lastName}`}
                />
              ))
            : null}
        </Grid>
      ) : null}
      {!showMessageSenders && (
        <Grid item xs={10} md={5} lg={8} xl={5} style={{ marginTop: "0" }}>
          <div style={{ textAlign: "end", marginBottom: "20px" }}>
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              style={{ marginTop: "5px" }}
              value={message}
              onChange={handleMessages}
            />
            <Button
              variant="text"
              style={{
                marginTop: "20px",
                alignSelf: "flex-end",
                textAlign: "right",
                justifySelf: "flex-end",
              }}
              onClick={sendMessage}
            >
              Send message
            </Button>
          </div>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "400px",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {messages
              ? messages
                  .filter(
                    (message) =>
                      message.senderId === chatParticipants.senderId ||
                      message.senderId === chatParticipants.receiverId
                  )
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((message, index) => (
                    <>
                      {console.log(message)}
                      <FlexBetween
                        key={index}
                        padding="0.5rem 1rem"
                        borderRadius="9px"
                        style={{
                          alignSelf:
                            message.senderId === userId
                              ? "flex-end"
                              : "flex-start",
                          backgroundColor:
                            message.senderId === userId ? "blue" : "green",
                          marginBottom: "5px",
                          color: "white",
                        }}
                      >
                        <Box>
                          <p>{` ${message.message}`}</p>
                          <p style={{ textAlign: "right", fontSize: "9px" }}>
                            {new Date(message.createdAt).toLocaleString() ===
                            Date.now().toLocaleString()
                              ? new Date(message.createdAt).getHours() +
                                ":" +
                                new Date(message.createdAt).getMinutes()
                              : new Date(message.createdAt).toLocaleString()}
                          </p>
                        </Box>
                      </FlexBetween>
                    </>
                  ))
              : null}{" "}
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

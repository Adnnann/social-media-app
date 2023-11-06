import { useEffect } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "state/userReducer";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { markMessagesAsRead } from "api/chatMutations";

export default function UserChats() {
  const showMessageSenders = useSelector((state) => state.showMessageSenders);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const token = useSelector(getToken);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const userId = useSelector((state) => state.user)._id;

  const params = {
    userId: userId,
    token: token,
  };

  const { mutate, isError, error, isSuccess } = useMutation({
    mutationKey: "messages",
    invalidatesTags: ["messages"],
    mutationFn: () => markMessagesAsRead(params),
    onSuccess: (data) => {
      dispatch(setMessages(data));
      queryClient.invalidateQueries("messages");
    },
  });

  useEffect(() => {
    mutate(params);
  }, []);

  return (
    <Grid
      container
      spacing={2}
      justifyContent={"center"}
      style={{ paddingTop: "5%", overflow: "hidden", width: "80%" }}
    ></Grid>
  );
}

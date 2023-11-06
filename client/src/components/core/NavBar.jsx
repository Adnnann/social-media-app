import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
  Button,
  ButtonGroup,
} from "@mui/material";
import { Search, DarkMode, LightMode, Menu, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "state/authReducer";

import {
  setLogout,
  setMessageSendersVisibility,
  getUserProfile,
  setMessages,
  setSearch,
  setFilteredUsers,
  getUserFullName,
} from "state/userReducer";

import { useNavigate } from "react-router-dom";
import FlexBetween from "components/utils/FlexBetween";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import MailIcon from "@mui/icons-material/Mail";
import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "state/authReducer";
import { useMutation } from "@tanstack/react-query";
import { searchUsersApi } from "api/usersMutations";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const search = useSelector((state) => state.user.search);
  const queryClient = useQueryClient();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const userData = useSelector(getUserProfile);
  const token = useSelector(getToken);
  const [queryTerm, setQueryTerm] = useState("");
  const fullName = useSelector(getUserFullName);

  const messages = useSelector((state) => state.user.messages);

  const userId = useSelector((state) => state.user.userId);

  const logout = () => {
    queryClient.removeQueries();
    dispatch(setLogout());
    navigate("/");
  };

  const {
    mutate: searchUsers,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error,
    isSuccess: isSuccessSearch,
  } = useMutation({
    mutationKey: ["filteredUsers"],
    mutationFn: () =>
      searchUsersApi(queryTerm.length > 0 ? queryTerm : "allUsers"),
    onSuccess: (data) => {
      dispatch(setSearch(true));
      dispatch(setFilteredUsers(data));
    },
  });

  const searchUsersByQuery = () => {
    console.log("queryTerm", queryTerm);
    if (queryTerm.length > 0) {
      dispatch(setSearch(true));
      searchUsers(queryTerm);
    } else {
      dispatch(setSearch(false));
    }
  };

  const navigateToChat = () => {
    const receiverId = userData._id;
    try {
      axios
        .get(`http://localhost:5000/chat/${receiverId}/receiveMessage`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          dispatch(setMessages(res.data));
          navigate(`/chat/${userData._id}`);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        {isNonMobileScreens && (
          <Typography
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
              fontWeight: "bold",
              fontSize: "clamp(1rem, 2rem, 2.25rem)",
              marginBottom: "0.5rem",
              border: "none",
            }}
            onClick={() => {
              dispatch(setSearch(false));
              navigate("/home");
            }}
          >
            {" "}
            EU4Agri Crew{" "}
          </Typography>
        )}

        {!isNonMobileScreens && (
          <ButtonGroup orientation="vertical">
            <Button
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
                fontWeight: "bold",
                fontSize: "clamp(1rem, 2rem, 2.25rem)",
                marginBottom: "0.5rem",
                border: "none",
                color: "white",
                textTransform: "none",
              }}
            >
              EU4Agri Crew{" "}
            </Button>
            <Button
              variant="outlined"
              style={{
                width: "120px",
                border: "none",
                color: "whitesmoke",
                fontSize: "clamp(0.75rem, 1rem, 1.25rem)",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={() => dispatch(setMessageSendersVisibility())}
            >
              See users
            </Button>
            ¯
          </ButtonGroup>
        )}

        {isNonMobileScreens && window.location.pathname === "/home" ? (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              onChange={(event) => setQueryTerm(event.target.value)}
            />
            <IconButton onClick={searchUsersByQuery}>
              <Search />
            </IconButton>
          </FlexBetween>
        ) : null}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween>
          <IconButton onClick={navigateToChat}>
            <Badge badgeContent={6} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>
          <IconButton
            style={{ marginRight: "20px" }}
            onClick={() => navigate("/userChats")}
          >
            <Badge
              badgeContent={
                messages.length > 0
                  ? messages.filter(
                      (message) =>
                        message.senderId === userId && !message.isRead
                    ).length
                  : null
              }
              color="error"
            >
              <MailIcon color="action" />
            </Badge>
          </IconButton>
          <Typography>{fullName}</Typography>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}></MenuItem>
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;

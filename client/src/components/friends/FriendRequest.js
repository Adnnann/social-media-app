import * as React from "react";

import Popover from "@mui/material/Popover";

import User from "components/users/User";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Icon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  AddCardOutlined,
  AddCircleOutline,
  CheckCircle,
  CheckCircleOutline,
  CloseSharp,
  RemoveCircleOutline,
} from "@mui/icons-material";
import WidgetWrapper from "components/utils/WidgetWrapper";
import FlexBetween from "components/utils/FlexBetween";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Advert from "components/users/Advert";
import FriendList from "components/users/FriendList";

export default function FriendRequests({ anchor, open }) {
  const isNonMobileScreens = window.innerWidth > 600;

  const users = [
    {
      firstName: "Adnan",
      lastName: "Ovcina",
      picturePath: "http://localhost:5000/assets/p1.jpeg",
      location: "Sarajevo",
      occupation: "Software Engineer",
    },
    {
      firstName: "Mak",
      lastName: "Ovcina",
      picturePath: "http://localhost:5000/assets/p1.jpeg",
      location: "Sarajevo",
      occupation: "Software Engineer",
    },
    {
      firstName: "Damir",
      lastName: "Ovcina",

      picturePath: "http://localhost:5000/assets/p1.jpeg",
      location: "Sarajevo",
      occupation: "Software Engineer",
    },
  ];

  const user = useSelector((state) => state.user.userProfile);

  return (
    <Grid container spacing={3} marginTop={"20px"} justifyContent={"center"}>
      <Grid item xs={12} md={5} lg={3}>
        <User userId={user._id} picturePath={user.picturePath} />
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        {users.map((user) => {
          return (
            <Card
              style={{
                marginBottom: "10px",

                borderRadius: "25px",
              }}
            >
              <CardHeader
                avatar={<Avatar src={user.picturePath} />}
                title={`${user.firstName} ${user.lastName}`}
                subheader={user.occupation + ", " + user.location}
                subheaderTypographyProps={{ color: "primary" }}
                action={
                  <>
                    <IconButton>
                      <Tooltip title="Accept">
                        <CheckCircleOutline fontSize="large" color="success" />
                      </Tooltip>
                    </IconButton>
                    <IconButton>
                      <Tooltip title="Decline">
                        <RemoveCircleOutline fontSize="large" color="warning" />
                      </Tooltip>
                    </IconButton>
                  </>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  You and {user.firstName} have 3 friends in common.
                </Typography>
                <Box style={{ display: "flex" }}>
                  <AvatarGroup
                    max={3}
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 24,
                        height: 24,
                        fontSize: 15,
                        marginTop: "5px",
                      },
                    }}
                    spacing="medium"
                  >
                    {users.map((item) => {
                      return (
                        <Tooltip title={item.firstName + " " + item.lastName}>
                          <Avatar
                            src={`http://localhost:5000/assets/${item.picturePath}`}
                            sx={{ width: 20, height: 20 }}
                          />
                        </Tooltip>
                      );
                    })}
                  </AvatarGroup>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Grid>
      {/* <User /> */}
      {isNonMobileScreens && (
        <Grid item xs={12} md={5} lg={2}>
          <Advert />
          <Box m="2rem 0" />
          <FriendList userId={user._id} />
        </Grid>
      )}
    </Grid>
  );
}

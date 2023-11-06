import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import UserImage from "components/users/UserImage";
import FlexBetween from "components/utils/FlexBetween";
import WidgetWrapper from "components/utils/WidgetWrapper";
import { useSelector } from "react-redux";

export default function SearchUsers() {
  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const users = useSelector((state) => state.user.filteredUsers);

  return users && Object.keys(users).length > 0
    ? users.map((user) => (
        <>
          <WidgetWrapper key={user.email}>
            {/* FIRST ROW */}
            <FlexBetween gap="0.5rem" pb="1.1rem">
              <FlexBetween gap="1rem">
                <UserImage
                  image={
                    user.picturePath || "http://localhost:5000/assets/p1.jpeg"
                  }
                />
                <Box>
                  <Typography
                    variant="h4"
                    color="#333333"
                    fontWeight="500"
                    //   sx={{
                    //     "&:hover":
                    //       userId !== loggedUser._id
                    //         ? {
                    //             color: palette.primary.light,
                    //             cursor: "pointer",
                    //           }
                    //         : null,
                    //   }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={medium}>
                    {user.friends.length || "5"} friends
                  </Typography>
                </Box>
              </FlexBetween>
              <PersonAddOutlined sx={{ color: primaryDark }} />
            </FlexBetween>

            <Divider />

            {/* SECOND ROW */}
            <Box p="1rem 0">
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                <Typography color={medium}>
                  {user.location || "Sarajevo"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap="1rem">
                <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                <Typography color={medium}>
                  {user.occupation || "Student"}
                </Typography>
              </Box>
            </Box>

            <Divider />
          </WidgetWrapper>
          <br />
        </>
      ))
    : null;
}

import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "../utilities/Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width={isNonMobileScreens ? "30%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="darkcyan"
          textAlign={"center"}
          style={{ marginBottom: "1.5rem" }}
        >
          EU4Agri Crew
        </Typography>
        <Typography
          fontWeight="500"
          variant="h3"
          sx={{ mb: "1.5rem", textAlign: "center" }}
        >
          Log In
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;

import { IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

export default function PopupComponent({ anchor, open }) {
  return (
    <div
      open={open}
      anchor={anchor}
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <IconButton>
        <Facebook fontSize="large" />
      </IconButton>
      <IconButton>
        <Instagram fontSize="large" />
      </IconButton>
      <IconButton>
        <Twitter fontSize="large" />
      </IconButton>
    </div>
  );
}

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

import React from "react";
import {
  Box,
  useMediaQuery,
} from "@mui/material";

export default function MeetingTutor() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <h1>Meeting Tutor</h1>
      <p>Schedule and join meetings here.</p>
    </Box>
  );
}

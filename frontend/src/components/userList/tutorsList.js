import React from "react";
import { Box, useMediaQuery } from "@mui/material";

export default function TutorList() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <h1>Tutor list</h1>
    </Box>
  );
}

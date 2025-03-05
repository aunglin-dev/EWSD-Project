import React from "react";
import { Box, useMediaQuery } from "@mui/material";

export default function StudentList() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <h1>Student list</h1>
    </Box>
  );
}

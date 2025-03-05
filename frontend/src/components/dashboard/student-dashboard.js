import { useParams } from "react-router";
import { STUDENT_OBJECTS } from "../../constants/static_data";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Card from "./card";
import MeetingCard from "./meeting-card";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function StudentDashboard() {
  const { id } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  //console.log("current user data=>", currentUser);
  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Typography variant="h4">{currentUser?.name}</Typography>
      <h3>{currentUser?.role} Dashboard</h3>
    </Box>
  );
}

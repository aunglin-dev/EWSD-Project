import React from "react";
import { Box, FiberManualRecordIcon, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";

export default function OtherMessageParty() {
  const { currentUser } = useSelector((state) => state.auth);
  //console.log("curent user =>", currentUser);
  return (
    <div>
      <Box sx={{ width: "250px", padding: "10px" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
        >
          <AccountCircleIcon sx={{ fontSize: "40px", marginRight: "10px" }} />
          <Box>
            <Typography variant="h6">
              {currentUser?.allocations[0]?.tutor}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {/* {otherParty?.role === "student" ? "Student" : "Tutor"} */}
              {currentUser?.role == "Student" ? "Tutor" : "Student"}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {/* Department: {otherParty?.department || "N/A"} */}
          Department : N/A
        </Typography>
      </Box>
    </div>
  );
}

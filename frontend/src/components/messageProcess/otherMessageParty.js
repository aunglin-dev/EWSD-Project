import React from "react";
import { Box, FiberManualRecordIcon, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function OtherMessageParty() {
  return (
    <div>
      <Box sx={{ width: "250px", padding: "10px" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
        >
          <AccountCircleIcon sx={{ fontSize: "40px", marginRight: "10px" }} />
          <Box>
            <Typography variant="h6">name</Typography>
            <Typography variant="body2" color="textSecondary">
              {/* {otherParty?.role === "student" ? "Student" : "Tutor"} */}
              tutor
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

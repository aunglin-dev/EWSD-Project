import React from "react";
import { Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useSelector } from "react-redux";

export default function LoginUserSide() {
  const { currentUser } = useSelector((state) => state.auth);

  //console.log("current user left side =>", currentUser);
  return (
    <div>
      <Box
        sx={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
        >
          <AccountCircleIcon sx={{ fontSize: "40px", marginRight: "10px" }} />
          <Box>
            <Typography variant="h6">{currentUser?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {currentUser?.role}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FiberManualRecordIcon
            sx={{
              fontSize: "10px",
              color: "green",
              marginRight: "5px",
            }}
          />
          <Typography variant="body2">Active</Typography>
        </Box>
      </Box>
    </div>
  );
}

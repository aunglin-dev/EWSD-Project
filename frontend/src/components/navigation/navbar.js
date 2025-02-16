import React, { useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Stafflogout } from "../../Storage/StaffSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentStaff } = useSelector((state) => state.staff);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const dispatch = useDispatch();

  const LogOut = () => {
    dispatch(Stafflogout());
    navigate("/");
  };

  return (
    <Box
      backgroundColor="black"
      color="white"
      width="100%"
      position="fixed"
      top="0"
      zIndex="999"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      boxSizing="border-box"
      padding={isNonMobileScreens ? "20px 15px" : "10px 5px"}
    >
      <Typography
        variant="h6"
        onClick={() => navigate("/StaffHome")}
        sx={{ cursor: "pointer" }}
      >
        ETutoring
      </Typography>

      {currentStaff && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => navigate("/allocate")}
            sx={{
              padding: "7px 16px",
              border: "1px solid white",
              borderRadius: "17px",
              backgroundColor: "white",
              color: "black",
              "&:hover": { backgroundColor: "#ddd" },
            }}
          >
            Allocate
          </Button>

          <IconButton onClick={() => LogOut()} color="inherit" sx={{ ml: 1 }}>
            <LogoutIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

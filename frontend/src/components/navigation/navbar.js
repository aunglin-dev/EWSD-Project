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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLinks } from "../../constants/static_data";
import { current } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Stafflogout } from "../../Storage/StaffSlice";

export default function Navbar() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeLink, setActiveLink] = useState("");
  const { currentStaff } = useSelector((state) => state.staff);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavClick = (link) => {
    setActiveLink(link);
  };

  const logOut = () => {
    handleMenuClose();
    dispatch(Stafflogout());
    navigate("/");
  };

  const location = useLocation();
  const path = location.pathname;

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
        onClick={() => { currentStaff ? navigate("/StaffHome") : navigate("/") }}
        sx={{ cursor: "pointer" }}
      >
        E-Tutoring Platform
      </Typography>

      {currentStaff && (
        <>
          <div style={{ display: "flex", gap: "15px", justifyContent: "space-between", alignItems: "center" }}>
            <Link to={"/StaffHome"} style={{ textDecoration: "none" }}>
              <Button
                onClick={() => handleNavClick("home")}
                sx={{
                  color: path === "/StaffHome" ? "yellow" : "white",
                  textDecoration: path === "/StaffHome" ? "underline" : "none",
                  "&:hover": { fontWeight: "bold" },
                }}
              >
                Home
              </Button>
            </Link>
            <Link to={"/allocate"} style={{ textDecoration: "none", width: "100px" }}>
              <Button
                onClick={() => handleNavClick("allocate")}
                sx={{
                  width: "100%",

                  color: path === "/allocate" ? "yellow" : "white",
                  textDecoration:
                    path === "/allocate" ? "underline" : "none",
                  "&:hover": { fontWeight: "bold" },
                }}
              >
                Allocation
              </Button>
            </Link>

            <Box
              sx={{ position: "relative", display: "flex", alignItems: "center" }}
            >

              <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 1 }}>
                <AccountCircleIcon sx={{ color: "white" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/staff-dashboard")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => logOut()}>Logout</MenuItem>
              </Menu>
            </Box>
          </div>

        </>
      )}
    </Box>
  );
}

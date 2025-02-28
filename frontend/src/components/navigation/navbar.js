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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLinks } from "../../constants/static_data";
import { current } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Stafflogout } from "../../Storage/StaffSlice";

export default function Navbar() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
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
      backgroundColor="#000"
      color="#fff"
      width="100%"
      position="fixed"
      top="0"
      zIndex="998"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      boxSizing="border-box"
      padding={isNonMobileScreens ? "20px 15px" : "10px"}
    >
      <Typography
        variant={isNonMobileScreens ? "h3" : "h5"}
        py={isNonMobileScreens ? "" : "12px"}
        onClick={() => { currentStaff ? navigate("/StaffHome") : navigate("/") }}
        sx={{ cursor: "pointer" }}
      >
        E-Tutoring Platform
      </Typography>

      {currentStaff &&
        (isNonMobileScreens ? (
          <div style={{ display: "flex", gap: "15px", justifyContent: "space-between", alignItems: "center" }}>
            <Link to={"/StaffHome"} style={{ textDecoration: "none" }}>
              <Button
                onClick={() => handleNavClick("home")}
                sx={{
                  color: "#fff",
                  fontWeight: path === "/StaffHome" ? "600" : "400",
                  textDecoration: path === "/StaffHome" ? "underline" : "none",
                  "&:hover": { fontWeight: "600" },
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
                  color: "#fff",
                  fontWeight: path === "/allocate" ? "600" : "400",
                  textDecoration:
                    path === "/allocate" ? "underline" : "none",
                  "&:hover": { fontWeight: "600" },
                }}
              >
                Allocation
              </Button>
            </Link>

            <Box
              sx={{ position: "relative", display: "flex", alignItems: "center" }}
            >

              <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 1 }}>
                <AccountCircleIcon sx={{ color: "#fff" }} />
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
        ) : (
          <IconButton
            sx={{}}
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>
        )
        )}

      {
        !isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="999"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor="#000"
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <CloseIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "space-between", alignItems: "center" }}>
              <Link to={"/StaffHome"} style={{ textDecoration: "none" }}>
                <Button
                  onClick={() => {
                    setIsMobileMenuToggled(!isMobileMenuToggled);
                    handleNavClick("home")
                  }}
                  sx={{
                    color: "#fff",
                    fontWeight: path === "/StaffHome" ? "600" : "400",
                    textDecoration: path === "/StaffHome" ? "underline" : "none",
                    "&:hover": { fontWeight: "600" },
                  }}
                >
                  Home
                </Button>
              </Link>
              <Link to={"/allocate"} style={{ textDecoration: "none", width: "100px" }}>
                <Button
                  onClick={() => {
                    setIsMobileMenuToggled(!isMobileMenuToggled);
                    handleNavClick("allocate")
                  }}
                  sx={{
                    width: "100%",
                    color: "#fff",
                    fontWeight: path === "/allocate" ? "600" : "400",
                    textDecoration:
                      path === "/allocate" ? "underline" : "none",
                    "&:hover": { fontWeight: "600" },
                  }}
                >
                  Allocation
                </Button>
              </Link>
              <Link to={"/staff-dashboard"} style={{ textDecoration: "none", width: "100px" }}>
                <Button
                  onClick={() => {
                    setIsMobileMenuToggled(!isMobileMenuToggled);
                    handleNavClick("allocate")
                  }}
                  sx={{
                    width: "100%",
                    color: "#fff",
                    fontWeight: path === "/staff-dashboard" ? "600" : "400",
                    textDecoration:
                      path === "/staff-dashboard" ? "underline" : "none",
                    "&:hover": { fontWeight: "600" },
                  }}
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setIsMobileMenuToggled(!isMobileMenuToggled);
                  logOut()
                }}
                sx={{
                  width: "100%",
                  color: "#fff",
                  fontWeight: "400",
                  "&:hover": { fontWeight: "600" },
                }}
              >
                Logout
              </Button>
            </div>

          </Box >
        )
      }
    </Box>
  );
}

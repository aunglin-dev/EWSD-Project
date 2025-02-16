import React, { useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { NavLinks } from "../../constants/static_data";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6">E-Tutoring Platform</Typography>

      <div style={{ display: "flex", gap: "15px" }}>
        {NavLinks.map((link) => {
          const NavPath = link === "Home" ? "/" : `/${link.toLowerCase()}`;
          return (
            <Link key={link} to={NavPath} style={{ textDecoration: "none" }}>
              <Button
                onClick={() => handleNavClick(link)}
                sx={{
                  color: activeLink === link ? "yellow" : "white",
                  textDecoration: activeLink === link ? "underline" : "none",
                  "&:hover": { fontWeight: "bold" },
                }}
              >
                {link}
              </Button>
            </Link>
          );
        })}
      </div>

      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Button
          onClick={() => navigate("/")}
          sx={{
            padding: "7px 16px",
            border: "1px solid white",
            borderRadius: "17px",
            backgroundColor: "white",
            color: "black",
            "&:hover": { backgroundColor: "#ddd" },
          }}
        >
          Login
        </Button>

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
          <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </div>
  );
}

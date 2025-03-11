import React, { useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Link as MuiLink,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Storage/authSlice";

export default function Navbar() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/");
  };

  const location = useLocation();
  const path = location.pathname;

  return (
    <Box
      backgroundColor="primary.main"
      color="#fff"
      width="100%"
      position="fixed"
      top="0"
      zIndex="998"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      boxSizing="border-box"
      padding={isNonMobileScreens ? "15px" : "10px"}
    >
      <Typography
        variant={isNonMobileScreens ? "h3" : "h4"}
        py={isNonMobileScreens ? "" : "12px"}
        onClick={() => {
          currentUser.role === "staff" ? navigate("/staff-dashboard")
            : currentUser.role === "Student" ? navigate(`/student-dashboard/${currentUser?._id}`)
              : currentUser.role === "Tutor" ? navigate("/tutor-dashboard")
                : navigate("/");
        }}
        sx={{ cursor: "pointer" }}
      >
        E-Tutoring Platform
      </Typography>

      {currentUser && (
        isNonMobileScreens ? (
          <Box sx={{ display: "flex", gap: "15px" }}>
            {currentUser.role === "staff" && (
              <>
                <Link to="/staff-dashboard" style={{ textDecoration: "none", width: "119px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/staff-dashboard" ? "600" : "400",
                      textDecoration: path === "/staff-dashboard" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Dashboard</Button>
                </Link>
                <Link to="/allocate" style={{ textDecoration: "none", width: "92px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/allocate" ? "600" : "400",
                      textDecoration: path === "/allocate" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Allocate</Button>
                </Link>
                <Link to="/tutors" style={{ textDecoration: "none", width: "99px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutors" ? "600" : "400",
                      textDecoration: path === "/tutors" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Tutor List</Button>
                </Link>
                <Link to="/students" style={{ textDecoration: "none", width: "123px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/students" ? "600" : "400",
                      textDecoration: path === "/students" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Student List</Button>
                </Link>
              </>
            )}

            {currentUser.role === "Student" && (
              <>
                <Link to={`/student-dashboard/${currentUser?._id}`} style={{ textDecoration: "none", width: "119px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === `/student-dashboard/${currentUser?._id}` ? "600" : "400",
                      textDecoration: path === `/student-dashboard/${currentUser?._id}` ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Dashboard</Button>
                </Link>
                <Link to="/student/message" style={{ textDecoration: "none", width: "99px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/student/message" ? "600" : "400",
                      textDecoration: path === "/student/message" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Message</Button>
                </Link>
                <Link to="/student/document" style={{ textDecoration: "none", width: "111px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/student/document" ? "600" : "400",
                      textDecoration: path === "/student/document" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Document</Button>
                </Link>
                <Link to="/student/meeting" style={{ textDecoration: "none", width: "91px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/student/meeting" ? "600" : "400",
                      textDecoration: path === "/student/meeting" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Meeting</Button>
                </Link>
              </>
            )}

            {currentUser.role === "Tutor" && (
              <>
                <Link to={"/tutor-dashboard"} style={{ textDecoration: "none", width: "119px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor-dashboard" ? "600" : "400",
                      textDecoration: path === "/tutor-dashboard" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Dashboard</Button>
                </Link>
                <Link to="/tutor/message" style={{ textDecoration: "none", width: "99px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor/message" ? "600" : "400",
                      textDecoration: path === "/tutor/message" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Message</Button>
                </Link>
                <Link to="/tutor/document" style={{ textDecoration: "none", width: "111px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor/document" ? "600" : "400",
                      textDecoration: path === "/tutor/document" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Document</Button>
                </Link>
                <Link to="/tutor/meeting" style={{ textDecoration: "none", width: "91px" }}>
                  <Button
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor/meeting" ? "600" : "400",
                      textDecoration: path === "/tutor/meeting" ? "underline" : "none",
                      "&:hover": { fontWeight: "600" },
                    }}
                  >Meeting</Button>
                </Link>
              </>
            )}
            <IconButton onClick={logOut}>
              <LogoutIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            sx={{}}
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>
        ))}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="999"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor="primary.main"
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {currentUser.role === "staff" && (
              <>
                <Link to="/staff-dashboard" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/staff-dashboard" ? "600" : "400",
                      textDecoration: path === "/staff-dashboard" ? "underline" : "none",
                    }}
                  >Dashboard</Button>
                </Link>
                <Link to="/allocate" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/allocate" ? "600" : "400",
                      textDecoration: path === "/allocate" ? "underline" : "none",
                    }}
                  >Allocate</Button>
                </Link>
                <Link to="/tutors" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutors" ? "600" : "400",
                      textDecoration: path === "/tutors" ? "underline" : "none",
                    }}
                  >Tutor List</Button>
                </Link>
                <Link to="/students" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/students" ? "600" : "400",
                      textDecoration: path === "/students" ? "underline" : "none",
                    }}
                  >Student List</Button>
                </Link>
              </>
            )}

            {currentUser.role === "Student" && (
              <>
                <Link to={`/student-dashboard/${currentUser?._id}`} style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === `/student-dashboard/${currentUser?._id}` ? "600" : "400",
                      textDecoration: path === `/student-dashboard/${currentUser?._id}` ? "underline" : "none",
                    }}
                  >Dashboard</Button>
                </Link>
                <Link to="/student/message" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/student/message" ? "600" : "400",
                      textDecoration: path === "/student/message" ? "underline" : "none",
                    }}
                  >Message</Button>
                </Link>
                <Link to="/student/document" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/student/document" ? "600" : "400",
                      textDecoration: path === "/student/document" ? "underline" : "none",
                    }}
                  >Document</Button>
                </Link>
                <Link to="/student/meeting" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/student/meeting" ? "600" : "400",
                      textDecoration: path === "/student/meeting" ? "underline" : "none",
                    }}
                  >Meeting</Button>
                </Link>
              </>
            )}

            {currentUser.role === "Tutor" && (
              <>
                <Link to={"/tutor-dashboard"} style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor-dashboard" ? "600" : "400",
                      textDecoration: path === "/tutor-dashboard" ? "underline" : "none",
                    }}
                  >Dashboard</Button>
                </Link>
                <Link to="/tutor/message" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor/message" ? "600" : "400",
                      textDecoration: path === "/tutor/message" ? "underline" : "none",
                    }}
                  >Message</Button>
                </Link>
                <Link to="/tutor/document" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor/document" ? "600" : "400",
                      textDecoration: path === "/tutor/document" ? "underline" : "none",
                    }}
                  >Document</Button>
                </Link>
                <Link to="/tutor/meeting" style={{ textDecoration: "none", width: "100%" }}>
                  <Button
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      fontWeight: path === "/tutor/meeting" ? "600" : "400",
                      textDecoration: path === "/tutor/meeting" ? "underline" : "none",
                    }}
                  >Meeting</Button>
                </Link>
              </>
            )}
            <IconButton onClick={() => {
              setIsMobileMenuToggled(!isMobileMenuToggled);
              logOut();
            }}>
              <LogoutIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 1 }}>
          <AccountCircleIcon sx={{ color: "white" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
        > */}
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
      {/* <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem> */}
      {/* <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
      </Box> */}
    </Box>
  );
}

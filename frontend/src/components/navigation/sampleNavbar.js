import React from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Link as MuiLink,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Storage/authSlice";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
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

      {currentUser && (
        <Box sx={{ display: "flex", gap: "15px" }}>
          {currentUser.role === "staff" && (
            <>
              <Link to="/staff-dashboard" style={{ textDecoration: "none" }}>
                <Button>Dashboard</Button>
              </Link>
              <Link to="/allocate" style={{ textDecoration: "none" }}>
                <Button>Allocate</Button>
              </Link>
              <Link to="/tutors" style={{ textDecoration: "none" }}>
                <Button>Tutor List</Button>
              </Link>
              <Link to="/students" style={{ textDecoration: "none" }}>
                <Button>Student List</Button>
              </Link>
            </>
          )}

          {currentUser.role === "Student" && (
            <>
              <Link
                to={`/student-dashboard/${currentUser?._id}`}
                style={{ textDecoration: "none" }}
              >
                <Button>Dashboard</Button>
              </Link>
              <Link to="/student/message" style={{ textDecoration: "none" }}>
                <Button>Message</Button>
              </Link>
              <Link to="/student/document" style={{ textDecoration: "none" }}>
                <Button>Document</Button>
              </Link>
              <Link to="/student/meeting" style={{ textDecoration: "none" }}>
                <Button>Meeting</Button>
              </Link>
            </>
          )}

          {currentUser.role === "Tutor" && (
            <>
              <Link to={"/tutor-dashboard"} style={{ textDecoration: "none" }}>
                <Button>Dashboard</Button>
              </Link>
              <Link to="/tutor/message" style={{ textDecoration: "none" }}>
                <Button>Message</Button>
              </Link>
              <Link to="/tutor/document" style={{ textDecoration: "none" }}>
                <Button>Document</Button>
              </Link>
              <Link to="/tutor/meeting" style={{ textDecoration: "none" }}>
                <Button>Meeting</Button>
              </Link>
            </>
          )}
        </Box>
      )}

      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 1 }}>
          <AccountCircleIcon sx={{ color: "white" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
        >
          {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
          {/* <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem> */}
          <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
      </Box>
    </div>
  );
}

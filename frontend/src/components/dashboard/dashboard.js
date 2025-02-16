import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import "./Sidebar.css";
import StudentDashboard from "./studentDashboard";
import TutorDashboard from "./tutorDasboard";
import StaffDashboard from "./staffDashboard";
import {
  STUDENT_OBJECTS,
  TUTOR_OBJECTS,
  STAFF_OBJECTS,
} from "../../constants/static_data";

const SIDEBAR_ITEMS = [
  { name: "Student Dashboard", id: "student" },
  { name: "Tutor Dashboard", id: "tutor" },
  { name: "Staff Dashboard", id: "staff" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("student");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = (page) => {
    setSelectedPage(page);
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "student":
        return (
          <div>
            <h1>Student Dasboard</h1>
            <StudentDashboard data={STUDENT_OBJECTS} />
          </div>
        );
      case "tutor":
        return (
          <div>
            <h1>Tutor Dasboard</h1>
            <TutorDashboard data={STUDENT_OBJECTS} />
          </div>
        );
      case "staff":
        return (
          <div>
            <h1>Staff dashboard</h1>
            <StaffDashboard />
          </div>
        );
      default:
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to the dashboard!</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Dashboard</Typography>
        </Toolbar>
        h1jlskdfk
      </AppBar>

      <Drawer
        sx={{
          width: isSidebarOpen ? 240 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 240 : 80,
            transition: "width 0.3s",
            backgroundColor: "#343a40",
            color: "white",
            boxSizing: "border-box",
            paddingTop: "64px",
          },
        }}
        variant="permanent"
        anchor="left"
        open={isSidebarOpen}
      >
        <div style={{ paddingLeft: "30px", fontSize: "30px" }}>Dashboard</div>
        <List>
          {SIDEBAR_ITEMS.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      <div
        style={{
          marginLeft: isSidebarOpen ? 50 : 80,
          padding: "0px",
          width: "100%",
          height: "100vh",
          overflow: "auto",
          transition: "margin-left 0.3s",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;

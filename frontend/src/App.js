import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "./theme";
import Navbar from "./components/navigation/navbar.js";
import LoginForm from "./components/loginForm/login-form.js";
import StaffHome from "./components/home/staff-home.js";
import AllocatePage from "./components/allocateProcess/allocate-page.js";
import AllocateForm from "./components/allocateProcess/allocate-form.js";
import AllocateReallocate from "./components/allocateProcess/allocate-reallocate.js";
import StudentDashboard from "./components/dashboard/student-dashboard.js";
import BlogPage from "./components/blog/blog-page.js";
import MessagePage from "./components/messageProcess/messagePage.js";
import MeetingPage from "./components/meetingProcess/meeting.js";
import StaffDashboard from "./components/dashboard/staffDashboard.js";

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings));

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/StaffHome" element={<StaffHome />} />
          {/* Staff */}

          <Route path="/allocate" element={<AllocatePage />} />
          <Route path="/addAllocation" element={<AllocateForm />} />
          <Route path="/allocateReallocate/:id" element={<AllocateReallocate />} />
          <Route path="/studentDashboard/:id" element={<StudentDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />

          {/* Student */}
          {/* <Route path="/student" element={<StudentHome />} /> */}
          <Route path="/blogs" element={<BlogPage />} />
          {/* <Route path="/blog/:id" element={<BlogPost />} /> */}
          <Route path="/student/message" element={<MessagePage />} />
          <Route path="/meeting" element={<MeetingPage />} />
          {/* <Route path="/documents" element={<Documents />} /> */}
          {/* <Route path="/document/:id" element={<DocumentDetail />} /> */}

          {/* Tutor */}
          {/* <Route path="/tutor" element={<TutorHome />} /> */}
          <Route path="/tutor/message" element={<MessagePage />} />
          <Route path="/tutor/meeting" element={<MeetingPage />} />
        </Routes>
      </ThemeProvider>
    </Router>

  )
}

export default App;

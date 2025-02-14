import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/navigation/navbar.js";
import LoginForm from "./Components/loginForm/login-form.js";
import Home from "./Components/home/home-page.js";
import AllocatePage from "./Components/allocateProcess/allocate-form.js";
import BlogPage from "./Components/blog/blog-page.js";
import MessagePage from "./Components/messageProcess/messagePage.js";
import MeetingPage from "./Components/meetingProcess/meeting.js";
import DashboardLayout from "./Components/dashboard/dashboard.js";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/allocate" element={<AllocatePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/message" element={<MessagePage />} />
      <Route path="/meeting" element={<MeetingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
    </Routes>
  </Router>
);

export default App;

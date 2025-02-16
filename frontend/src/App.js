import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navigation/navbar.js";
import LoginForm from "./components/loginForm/login-form.js";
import Home from "./components/home/home-page.js";
import AllocatePage from "./components/allocateProcess/allocate-page.js";
import BlogPage from "./components/blog/blog-page.js";
import MessagePage from "./components/messageProcess/messagePage.js";
import MeetingPage from "./components/meetingProcess/meeting.js";
import DashboardLayout from "./components/dashboard/dashboard.js";

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

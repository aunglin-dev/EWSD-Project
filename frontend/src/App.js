import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navigation/navbar";
import LoginForm from "./components/loginForm/login-form";
import Home from "./components/home/home-page";
import AllocatePage from "./components/allocateProcess/allocate-page";
import BlogPage from "./components/blog/blog-page";
import MessagePage from "./components/messageProcess/messagePage";
import MeetingPage from "./components/meetingProcess/meeting";
import DashboardLayout from "./components/dashboard/dashboard";

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

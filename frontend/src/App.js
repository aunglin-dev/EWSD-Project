import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navigation/navbar.js";
import LoginForm from "./components/loginForm/login-form.js";
import StaffHome from "./components/home/staff-home.js";
import AllocatePage from "./components/allocateProcess/allocate-page.js";
import AllocateForm from "./components/allocateProcess/allocate-form.js";
import StudentDashboard from "./components/dashboard/student-dashboard.js";
import BlogPage from "./components/blog/blog-page.js";
import MessagePage from "./components/messageProcess/messagePage.js";
import MeetingPage from "./components/meetingProcess/meeting.js";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/StaffHome" element={<StaffHome />} />
      {/* Staff */}

      <Route path="/allocate" element={<AllocatePage />} />
      <Route path="/addAllocation" element={<AllocateForm />} />
      <Route path="/studentDashboard/:id" element={<StudentDashboard />} />

      {/* Student */}
      {/* <Route path="/student" element={<StudentHome />} /> */}
      <Route path="/blogs" element={<BlogPage />} />
      {/* <Route path="/blog/:id" element={<BlogPost />} /> */}
      <Route path="/student/message" element={<MessagePage />} />
      <Route path="/student/meeting" element={<MeetingPage />} />
      {/* <Route path="/documents" element={<Documents />} /> */}
      {/* <Route path="/document/:id" element={<DocumentDetail />} /> */}

      {/* Tutor */}
      {/* <Route path="/tutor" element={<TutorHome />} /> */}
      <Route path="/tutor/message" element={<MessagePage />} />
      <Route path="/tutor/meeting" element={<MeetingPage />} />
    </Routes>
  </Router>
);

export default App;

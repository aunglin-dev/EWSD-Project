import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navigation/sampleNavbar.js";
import LoginForm from "./components/loginForm/login-form.js";
import AllocatePage from "./components/allocateProcess/allocate-page.js";
import AllocateForm from "./components/allocateProcess/allocate-form.js";
import StudentDashboard from "./components/dashboard/student-dashboard.js";
import MessagePage from "./components/messageProcess/messagePage.js";
import MeetingPage from "./components/meetingProcess/meeting.js";
import StaffDashboard from "./components/dashboard/staffDashboard.js";
import TutorList from "./components/userList/tutorsList.js";
import StudentList from "./components/userList/studentsList.js";
import DocumentPage from "./components/documentProcess/documentPage.js";
import TutorDashboard from "./components/dashboard/tutorDasboard.js";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<LoginForm />} />

      {/* Staff */}
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
      <Route path="/allocate" element={<AllocatePage />} />
      <Route path="/addAllocation" element={<AllocateForm />} />
      <Route path="/tutors" element={<TutorList />} />
      <Route path="/students" element={<StudentList />} />

      {/* Student */}
      <Route path="/student-dashboard/:id" element={<StudentDashboard />} />
      <Route path="/student/message" element={<MessagePage />} />
      <Route path="/student/meeting" element={<MeetingPage />} />
      <Route path="/student/document" element={<DocumentPage />} />
      {/* <Route path="/document/:id" element={<DocumentDetail />} /> */}

      {/* Tutor */}
      {/* <Route path="/tutor" element={<TutorHome />} /> */}
      <Route path="/tutor-dashboard" element={<TutorDashboard />} />
      <Route path="/tutor/message" element={<MessagePage />} />
      <Route path="/tutor/meeting" element={<MeetingPage />} />
      <Route path="/tutor/document" element={<DocumentPage />} />
    </Routes>
  </Router>
);

export default App;

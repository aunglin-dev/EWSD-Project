import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "./theme";
import Navbar from "./components/navigation/sampleNavbar.js";
import LoginForm from "./components/loginForm/login-form.js";
import AllocatePage from "./components/allocateProcess/allocate-page.js";
import AllocateForm from "./components/allocateProcess/allocate-form.js";
import AllocateReallocate from "./components/allocateProcess/allocate-reallocate.js";
import StudentDashboard from "./components/dashboard/student-dashboard.js";
import MessagePage from "./components/messageProcess/messagePage.js";
import MeetingStudent from "./components/meetingProcess/meeting-student.js";
import MeetingPage from "./components/meetingProcess/meeting.js";
import StaffDashboard from "./components/dashboard/staffDashboard.js";
import TutorList from "./components/userList/tutorsList.js";
import StudentList from "./components/userList/studentsList.js";
import DocumentPage from "./components/documentProcess/documentPage.js";
import TutorDocumentPage from "./components/documentProcess/tutor-documentPage.js";
import TutorDashboard from "./components/dashboard/tutorDasboard.js";

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings));

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />

          {/* Staff */}
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/allocate" element={<AllocatePage />} />
          <Route path="/addAllocation" element={<AllocateForm />} />
          <Route path="/tutors" element={<TutorList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/allocateReallocate/:id" element={<AllocateReallocate />} />

          {/* Student */}
          <Route path="/student-dashboard/:id" element={<StudentDashboard />} />
          <Route path="/student/message" element={<MessagePage />} />
          <Route path="/student/meeting" element={<MeetingStudent />} />
          <Route path="/student/document" element={<DocumentPage />} />
          {/* <Route path="/document/:id" element={<DocumentDetail />} /> */}
          {/* <Route path="/allocate" element={<AllocatePage />} />
          <Route path="/addAllocation" element={<AllocateForm />} /> */}

          {/* <Route path="/studentDashboard/:id" element={<StudentDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} /> */}

          {/* Tutor */}
          {/* <Route path="/tutor" element={<TutorHome />} /> */}
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/message" element={<MessagePage />} />
          <Route path="/tutor/meeting" element={<MeetingPage />} />
          <Route path="/tutor/document" element={<TutorDocumentPage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App;

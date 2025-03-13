import express from "express";
import { assignedStudentByTutorId, assignedStudentByTutorIdCount, confirmedMeetingTdy, meetingCompletedThisMonth, pendingMeetingCount, pendingMeetings, requestedMeetingCountOfStudent, requestedMeetingsOfStudent, totalStudent, totalTutor, unallocatedStudents, unallocatedTutorCount, unallocatedTutors, upcommingMeetingCount, upcommingMeetingCountOfStudent, upcommingMeetings, upcommingMeetingsOfStudent } from "../Controller/dashboardController.js";
const dashboardRoute = express.Router();

//Staff Routes
dashboardRoute.get('/totalTutor', totalTutor)
dashboardRoute.get('/totalStudent', totalStudent)
dashboardRoute.get('/unallocatedTutorCount', unallocatedTutorCount)
dashboardRoute.get('/unallocatedTutors', unallocatedTutors)
dashboardRoute.get('/unallocatedStudentCount', unallocatedTutorCount)
dashboardRoute.get('/unallocatedStudents', unallocatedStudents)

//Tutors
dashboardRoute.get('/tutor/:tutorId/totalAssignedStudents', assignedStudentByTutorId)
dashboardRoute.get('/tutor/:tutorId/totalAssignedStudentCount', assignedStudentByTutorIdCount)
dashboardRoute.get('/tutor/:tutorId/upcommingMeetings', upcommingMeetings)
dashboardRoute.get('/tutor/:tutorId/upcommingMeetingCount', upcommingMeetingCount)
dashboardRoute.get('/tutor/:tutorId/requestedMeetings', pendingMeetings)
dashboardRoute.get('/tutor/:tutorId/requestedMeetingCount', pendingMeetingCount)
dashboardRoute.get('/tutor/:tutorId/completedMeetingsThisMonth', meetingCompletedThisMonth)
dashboardRoute.get('/tutor/:tutorId/confirmedMeetingsToday', confirmedMeetingTdy)

//Students
dashboardRoute.get('/student/:studentId/upcommingMeetings', upcommingMeetingsOfStudent)
dashboardRoute.get('/student/:studentId/upcommingMeetingCount', upcommingMeetingCountOfStudent)
dashboardRoute.get('/student/:studentId/requestedMeetings', requestedMeetingsOfStudent)
dashboardRoute.get('/student/:studentId/requestedMeetingCount', requestedMeetingCountOfStudent)






export default dashboardRoute;
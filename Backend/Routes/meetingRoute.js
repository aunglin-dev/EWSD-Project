import express from "express";
import {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    getAllMeetingsByRole,
    getMeetingsByRoleAndAllocationId,
    getMeetingsByAllocationId,
    updateMeeting,
    deleteMeeting,
    deleteMeetingsByRoleAndAllocationId,
    deleteMeetingsByAllocationId
} from "../Controller/meetingController.js";

export const meetingRouter = express.Router();


meetingRouter.get("/", getAllMeetings); // Get all meetings
meetingRouter.get("/:id", getMeetingById); // Get a meeting by ID
meetingRouter.get("/role/:role/", getAllMeetingsByRole); // Get All meetings by Role
meetingRouter.get("/allocation/:allocationId", getMeetingsByAllocationId); // Get meetings by Allocation ID only
meetingRouter.get("/allocation/:role/:allocationId", getMeetingsByRoleAndAllocationId); // Get meetings by Role and Allocation ID

meetingRouter.post("/", createMeeting); // Create a new meeting


meetingRouter.put("/:id", updateMeeting); // Update a meeting by ID


meetingRouter.delete("/:id", deleteMeeting); // Delete a meeting by ID
meetingRouter.delete("/allocation/:role/:allocationId", deleteMeetingsByRoleAndAllocationId); // Delete meetings by Role and Allocation ID
meetingRouter.delete("/allocation/:allocationId", deleteMeetingsByAllocationId); // Delete meetings by Allocation ID only

export default meetingRouter;

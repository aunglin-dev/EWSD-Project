import express from 'express';
import {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
} from '../Controller/meetingController.js';

const meetingRouter = express.Router();

// Define meeting routes
meetingRouter.get('/', getAllMeetings); // Get all meetings
meetingRouter.get('/:id', getMeetingById); // Get a meeting by ID

meetingRouter.post('/', createMeeting); // Create a meeting

meetingRouter.put('/:id', updateMeeting); // Update a meeting
meetingRouter.delete('/:id', deleteMeeting); // Delete a meeting

export default meetingRouter;

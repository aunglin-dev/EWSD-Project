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
meetingRouter.post('/', createMeeting);
meetingRouter.get('/', getAllMeetings);
meetingRouter.get('/:id', getMeetingById);
meetingRouter.put('/:id', updateMeeting);
meetingRouter.delete('/:id', deleteMeeting);

export default meetingRouter;

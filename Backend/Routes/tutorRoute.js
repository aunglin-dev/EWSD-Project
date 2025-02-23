import express from 'express';
import {
    createTutor,
    getAllTutors,
    getTutorById,
    updateTutor,
    deleteTutor
} from '../Controller/tutorController.js';

const tutorRouter = express.Router();

// Define tutor routes
tutorRouter.get('/', getAllTutors); // Get all tutors
tutorRouter.get('/:id', getTutorById); //  Get a tutor by ID

tutorRouter.post('/', createTutor); // Create a tutor

tutorRouter.put('/:id', updateTutor); // Update a tutor

tutorRouter.delete('/:id', deleteTutor); // Delete a tutor

export default tutorRouter;

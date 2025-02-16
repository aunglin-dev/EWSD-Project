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
tutorRouter.post('/', createTutor);
tutorRouter.get('/', getAllTutors);
tutorRouter.get('/:id', getTutorById);
tutorRouter.put('/:id', updateTutor);
tutorRouter.delete('/:id', deleteTutor);

export default tutorRouter;

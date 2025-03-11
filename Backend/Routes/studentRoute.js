import express from 'express';
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from '../Controller/studentController.js';

const studentRouter = express.Router();

//Define Route For Student Collection

studentRouter.get('/', getAllStudents);  // Get all students
studentRouter.get('/:id', getStudentById); // Get a student by ID

studentRouter.post('/', createStudent);  // Create a student

studentRouter.put('/:id', updateStudent); // Update student by ID

studentRouter.delete('/:id', deleteStudent); // Delete student by ID

export default studentRouter;

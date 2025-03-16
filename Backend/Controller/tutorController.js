import Tutor from '../Model/Tutor.js';
import UserActivity from '../Model/UserActivity.js';


// Create a new tutor
export const createTutor = async (req, res) => {
    try {
        const tutor = new Tutor(req.body);
        await tutor.save();
        res.status(201).json(tutor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tutors
export const getAllTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find();
        if (!tutors.length) return res.status(404).json({ message: 'Tutors not found' });
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single tutor by ID
export const getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
        res.status(200).json(tutor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a tutor by ID
export const updateTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
        res.status(200).json(tutor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a tutor by ID
export const deleteTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByIdAndDelete(req.params.id);
        if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
        await UserActivity.deleteMany({userId : req.params.id});
        res.status(200).json({ message: 'Tutor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

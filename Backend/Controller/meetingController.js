import Meeting from '../Model//Meeting.js';

// Create a new meeting
export const createMeeting = async (req, res) => {
    try {
        const meeting = new Meeting(req.body);
        await meeting.save();
        res.status(201).json(meeting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all meetings
export const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().populate('tutor student');
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single meeting by ID
export const getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id).populate('tutor student');
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a meeting by ID
export const updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('tutor student');
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json(meeting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a meeting by ID
export const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id);
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

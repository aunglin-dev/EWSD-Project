import Meeting from "../Model/Meeting.js";

//  Create a new meeting
export const createMeeting = async (req, res) => {
    try {
        const { role, allocationId, dateTime, type, note, meetingLink, meetingLocation, meetingPlatform } = req.body;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const newMeeting = new Meeting({
            role: formattedRole,
            allocationId,
            dateTime,
            type,
            note,
            meetingLink,
            meetingLocation,
            meetingPlatform
        });

        await newMeeting.save();
        res.status(201).json(newMeeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get all meetings
export const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find();

        if (!meetings.length) {
            return res.status(404).json({ error: "No meetings found for this role and allocation ID" });
        }
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get a single meeting by ID
export const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findById( id );

        if (!meeting) {
            return res.status(404).json({ error: "Meeting not found" });
        }

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get meetings by Role and Allocation ID
export const getMeetingsByRoleAndAllocationId = async (req, res) => {
    try {
        const { role, allocationId } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const meetings = await Meeting.find({ role: formattedRole, allocationId });

        if (!meetings.length) {
            return res.status(404).json({ error: "No meetings found for this role and allocation ID" });
        }

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get meetings by Role
export const getAllMeetingsByRole = async (req, res) => {
    try {
        const { role } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const meetings = await Meeting.find({ role: formattedRole });

        if (!meetings.length) {
            return res.status(404).json({ error: "No meetings found for this role" });
        }

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//  Get meetings by Allocation ID only
export const getMeetingsByAllocationId = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const meetings = await Meeting.find({ allocationId });

        if (!meetings.length) {
            return res.status(404).json({ error: "No meetings found for this allocation ID" });
        }

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Update a meeting by ID
export const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, allocationId, dateTime, type, note, meetingLink, meetingLocation, meetingPlatform } = req.body;


        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const updatedMeeting = await Meeting.findByIdAndUpdate(
                id,
            { role: formattedRole, allocationId, dateTime, type, note, meetingLink, meetingLocation, meetingPlatform },
            { new: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({ error: "Meeting not found" });
        }

        res.json(updatedMeeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Delete a meeting by ID
export const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMeeting = await Meeting.findByIdAndDelete(id);

        if (!deletedMeeting) {
            return res.status(404).json({ error: "Meeting not found" });
        }

        res.json({ message: "Meeting deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Delete meetings by Role and Allocation ID
export const deleteMeetingsByRoleAndAllocationId = async (req, res) => {
    try {
        const { role, allocationId } = req.params;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const result = await Meeting.deleteMany({ role: formattedRole, allocationId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No meetings found for this role and allocation ID" });
        }

        res.json({ message: "Meetings deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Delete meetings by Allocation ID only
export const deleteMeetingsByAllocationId = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const result = await Meeting.deleteMany({ allocationId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No meetings found for this allocation ID" });
        }

        res.json({ message: "Meetings deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

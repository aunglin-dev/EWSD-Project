import Meeting from "../Model/Meeting.js";
import Student from "../Model/Student.js";
import Tutor from "../Model/Tutor.js";
import Allocation from "../Model/Allocation.js";

//  Create a new meeting
export const createMeeting = async (req, res) => {
    try {
        const { role, allocationId, dateTime, type, title, remark, meetingLink, meetingLocation, meetingPlatform, status } = req.body;

        // Capitalize first letter of role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        const newMeeting = new Meeting({
            role: formattedRole,
            allocationId,
            dateTime,
            type,
            title,
            remark,
            meetingLink,
            meetingLocation,
            meetingPlatform,
            status,
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
            return res.status(404).json([]);
        }
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllMeetingsbyTutorId = async (req, res) => {
    try {
        const { tutorId } = req.params;

        // Find the allocation for the given tutorId
        const allocations = await Allocation.find({ tutor: tutorId });

        if (!allocations || allocations.length === 0) {
            return res.status(404).json({ error: "No meetings found for this tutor" });
        }

        // Array to hold all meetings with student information
        let allMeetings = [];

        // Loop through the allocations to get the meetings
        for (const allocation of allocations) {
            const meetings = await Meeting.find({ allocationId: allocation._id });

            // Fetch student details using the Student model
            const student = await Student.findById(allocation.student);

            // Loop through each meeting and create a new object containing both the meeting and student
            for (var meeting of meetings) {
                var meetingWithStudent = {
                    ...meeting.toObject(), // Convert meeting to plain object
                    student: student,      // Add the student details to the meeting object
                };

                // Add the new object with meeting and student to the array
                allMeetings.push(meetingWithStudent);
            }
        }

        // Return the meetings with associated student details
        res.json(allMeetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getConfirmedMeetingsTodayByTutorId = async (req, res) => {
    try {
        const { tutorId } = req.params;

        // Get today's date (start of the day and end of the day)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Set to the start of today (midnight)

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // Set to the end of today (just before

        // Find the allocation for the given tutorId
        const allocations = await Allocation.find({ tutor: tutorId });

        if (!allocations || allocations.length === 0) {
            return res.status(404).json({ error: "No meetings found for this tutor" });
        }

        // Array to hold all meetings with student information
        let allMeetings = [];

        for (const allocation of allocations) {
            // Find meetings for the allocation with status 3 (confirmed) and today's date
            const meetings = await Meeting.find({
                allocationId: allocation._id, // Allocation Id that link meeting to tutor & student
                status: 1, //Confirmed Status
                dateTime: {
                    $gte: todayStart,    // Greater than or equal to today's start
                    $lte: todayEnd      // Less than or equal to today's end
                }
            });

            // Fetch student details using the Student model
            const student = await Student.findById(allocation.student);

            // Loop through each meeting and create a new object containing both the meeting and student
            for (var meeting of meetings) {
                var meetingWithStudent = {
                    ...meeting.toObject(), // Convert meeting to plain object
                    student: student,      // Add the student details to the meeting object
                };

                // Add the new object with meeting and student to the array
                allMeetings.push(meetingWithStudent);
            }
        }
        res.json(allMeetings);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getLastConfirmedMeetingByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find the allocation that belongs to the student
        const allocation = await Allocation.findOne({ student: studentId });

        if (!allocation) {
            return res.status(404).json({ error: "No allocation found for this student" });
        }

        // Find the last confirmed meeting for the given allocation (sorted by dateTime descending)
        const meeting = await Meeting.findOne({
            allocationId: allocation._id,
            status: 1, // Status 3 represents confirmed meetings
        })
            .sort({ dateTime: -1 });  // Sort by dateTime in descending order to get the latest meeting

        if (!meeting) {
            return res.status(404).json([]);
        }

        // Fetch the tutor associated with this meeting
        var tutor = { _id: allocation.tutor };
        tutor = await Tutor.findById(allocation.tutor);

        // Fetch the student details (even though we already have the student in allocation, we'll do this to add any additional info if needed)
        var student = { _id: allocation.student }
        student = await Student.findById(studentId);

        // Construct the response object
        const meetingWithDetails = {
            ...meeting.toObject(),
            student: student, // Attach full student details
            tutor: tutor,     // Attach full tutor details
        };

        // Return the meeting with student and tutor details
        res.json([meetingWithDetails]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get a single meeting by ID
export const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findById(id);

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

export const getMostUsedPlatform = async (req, res) => {
    try {
        const mostUsedPlatform = await Meeting.aggregate([
            // Group by 'pageViewed' and count the occurrences
            {
                $group: {
                    _id: "$meetingPlatform", // Group by the pageViewed field
                    count: { $sum: 1 }  // Count the number of occurrences
                }
            },
            // Sort by count in descending order
            {
                $sort: { count: -1 }
            },
            // Limit to the top 10 results
            {
                $limit: 10
            },
            // Optionally, project the fields for a cleaner output
            {
                $project: {
                    _id: 0,            // Exclude the default _id field
                    platform: "$_id",      // Rename _id to 'page'
                    count: 1            // Include the count field
                }
            }
        ]);

        // Check if there are any results
        if (!mostUsedPlatform.length) {
            return res.status(404).json({ message: 'No platform found' });
        }

        // Return the top 10 most viewed pages
        res.status(200).json(mostUsedPlatform);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Update a meeting by ID
export const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const meetingDocument = req.body;


        // Capitalize first letter of role
        const formattedRole = meetingDocument?.role
            ? meetingDocument.role.charAt(0).toUpperCase() + meetingDocument.role.slice(1)
            : undefined;

        const updatedMeeting = await Meeting.findByIdAndUpdate(
            id,
            { ...meetingDocument, ...(formattedRole && { role: formattedRole }) }, // Only update role if it exists
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

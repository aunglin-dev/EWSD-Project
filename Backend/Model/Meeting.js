import mongoose from 'mongoose';
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import { meetingNotificationEmail, meetingNotificationEmailForTutor } from "../Service/emailTemplates.js";
import roleTypes from "./roleType.js";
import meetingTypes from "./meetingType.js";

const meetingSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: roleTypes,
        required: true
    },
    allocationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Allocation",
        required: true,
    },
    dateTime: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: meetingTypes,
        required: true
    },
    note: {
        type: String,
        default: ""
    }
}, { timestamps: true });


meetingSchema.pre("save", async function (next) {
    try {
    
        // Check for duplicate meeting (same date, time, student, tutor)
        const existingMeeting = await mongoose.model("Meeting").findOne({
            dateTime: this.dateTime,
            allocationId: this.allocationId,
            type: this.type,
        });

        if (existingMeeting) {
            return next(new Error("A meeting with the same date, time, student, and tutor already exists."));
        }


        next(); // Proceed to save the meeting
    } catch (err) {
        next(err);
    }
});


// 🔹 Post-Save Hook: Send Email When Meeting is Created
meetingSchema.post("save", async function (doc) {
    try {
        // Fetch allocation using allocationId
        const allocation = await mongoose.model("Allocation").findById(doc.allocationId)
            .populate("tutor") 
            .populate("student"); 

        if (!allocation) {
            console.error("Allocation not found for meeting:", doc.allocationId);
            return;
        }

        const { tutor, student } = allocation; // Extract tutor and student

        if (!tutor || !student) {
            console.error("Tutor or student not found in allocation:", doc.allocationId);
            return;
        }

        // Generate email content
        const { subjectStudent, messageStudent } = meetingNotificationEmail("created", tutor, student, doc);
        const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("created", tutor, student, doc);

        // Send email to student
        await emailTransporter.sendMail({
            from: emailAddress,
            to: student.email,
            subject: subjectStudent,
            html: messageStudent
        });

        // Send email to tutor
        await emailTransporter.sendMail({
            from: emailAddress,
            to: tutor.email,
            subject: subjectTutor,
            html: messageTutor
        });

        console.log("Meeting creation emails sent successfully.");
    } catch (error) {
        console.error("Error sending meeting creation email:", error);
    }
});

meetingSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();
        const allocationId = update.allocationId;  // Allocation ID being updated
        const dateTime = update.dateTime; // New meeting date
        const type = update.type; // New Meeting Type

        // Check for duplicate meeting (same date, time, student, tutor)
        const existingMeeting = await mongoose.model("Meeting").findOne({
            allocationId: allocationId,
            dateTime: dateTime,
            type: type,
        });

        if (existingMeeting) {
            return next(new Error("A meeting with the same date, time, type, student, and tutor already exists."));
        }


        next();  // Proceed with the update if the allocation exists

    } catch (error) {
        console.error("Error in pre-update hook for allocation check:", error);
        next(error);
    }
});



// 🔹 Post-Update Hook: Send Email When Meeting is Updated
meetingSchema.post("findOneAndUpdate", async function (doc) {
    try {
        if (!doc) return;

        // Fetch allocation using allocationId
        const allocation = await mongoose.model("Allocation").findById(doc.allocationId)
            .populate("tutor") 
            .populate("student"); 

        if (!allocation) {
            console.error("Allocation not found for meeting:", doc.allocationId);
            return;
        }

        const { tutor, student } = allocation; // Extract tutor and student

        if (!tutor || !student) {
            console.error("Tutor or student not found in allocation:", doc.allocationId);
            return;
        }

        // Generate email content
        const { subjectStudent, messageStudent } = meetingNotificationEmail("updated", tutor, student, doc);
        const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("updated", tutor, student, doc);

        // Send email to student
        await emailTransporter.sendMail({
            from: emailAddress,
            to: student.email,
            subject: subjectStudent,
            html: messageStudent
        });

        // Send email to tutor
        await emailTransporter.sendMail({
            from: emailAddress,
            to: tutor.email,
            subject: subjectTutor,
            html: messageTutor
        });

        console.log("Meeting update emails sent successfully.");
    } catch (error) {
        console.error("Error sending meeting update email:", error);
    }
});

// Pre-Delete Hook: Send Email When Meeting is Deleted
meetingSchema.pre("findOneAndDelete", async function (next) {
    try {
        const meetingId = this.getQuery()._id; // Get the Meeting ID being deleted
        const meeting = await mongoose.model("Meeting").findById(meetingId);

        if (!meeting) return next();

        // Fetch allocation using allocationId
        const allocation = await mongoose.model("Allocation").findById(meeting.allocationId)
            .populate("tutor") 
            .populate("student"); 

        if (!allocation) {
            console.error("Allocation not found for meeting:", meeting.allocationId);
            return next();
        }

        const { tutor, student } = allocation; // Extract tutor and student

        if (!tutor || !student) {
            console.error("Tutor or student not found in allocation:", meeting.allocationId);
            return next();
        }

        // Generate email content
        const { subjectStudent, messageStudent } = meetingNotificationEmail("deleted", tutor, student, meeting);
        const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("deleted", tutor, student, meeting);

        // Send email to student
        await emailTransporter.sendMail({
            from: emailAddress,
            to: student.email,
            subject: subjectStudent,
            html: messageStudent
        });

        // Send email to tutor
        await emailTransporter.sendMail({
            from: emailAddress,
            to: tutor.email,
            subject: subjectTutor,
            html: messageTutor
        });

        console.log("Meeting cancellation emails sent successfully.");
        next();
    } catch (error) {
        console.error("Error sending meeting cancellation email:", error);
        next(error);
    }
});


const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;

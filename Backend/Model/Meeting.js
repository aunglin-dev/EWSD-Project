import mongoose from 'mongoose';
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import { meetingNotificationEmail, meetingNotificationEmailForTutor  } from "../Service/emailTemplates.js";


const MeetingSchema = new mongoose.Schema({
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },  // Example: "14:00"
    location: { type: String }, // Optional for real meetings
    meetingType: { type: String, enum: ['real', 'virtual'], required: true },
    virtualLink: { type: String } // Optional for virtual meetings
}, { timestamps: true });





MeetingSchema.pre("save", async function (next) {
    try {
    
        const tutor = await mongoose.model("Tutor").findById(this.tutor);
        const student = await mongoose.model("Student").findById(this.student);

        if (!tutor || !student) {
            return next(new Error("Tutor or Student not found"));
        }


        if (!tutor.students.includes(this.student)) {
            return next(new Error("Student is not assigned to this tutor"));
        }


        // Check for duplicate meeting (same date, time, student, tutor)
        const existingMeeting = await mongoose.model("Meeting").findOne({
            tutor: this.tutor,
            student: this.student,
            date: this.date,
            time: this.time,
            meetingType: this.meetingType, 
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
MeetingSchema.post("save", async function (doc) {
    try {
        const tutor = await mongoose.model("Tutor").findById(doc.tutor);
        const student = await mongoose.model("Student").findById(doc.student);

        if (!tutor) {
            console.log("Cannot find tutor!");
            return
        };

        if (!student) {
            console.log("Cannot find student!");
            return
        };
    

        const { subjectStudent, messageStudent } = meetingNotificationEmail("created", tutor, student, doc);

        await emailTransporter.sendMail({
            from: emailAddress,
            to: student.email,
            subjectStudent,
            html: messageStudent
        });


        const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("created", tutor, student, doc);

        await emailTransporter.sendMail({
            from: emailAddress,
            to: tutor.email,
            subjectTutor,
            html: messageTutor
        });

        console.log("Meeting creation email sent.");
    } catch (error) {
        console.error("Error sending meeting creation email:", error);
    }
});

// 🔹 Post-Update Hook: Send Email When Meeting is Updated
MeetingSchema.post("findOneAndUpdate", async function (doc) {
    try {
        if (!doc) return;

        const tutor = await mongoose.model("Tutor").findById(doc.tutor);
        const student = await mongoose.model("Student").findById(doc.student);

        if (!tutor || !student) return;


        const { subjectStudent, messageStudent } = meetingNotificationEmail("updated", tutor, student, doc);

        await emailTransporter.sendMail({
            from: emailAddress,
            to: student.email,
            subjectStudent,
            html: messageStudent
        });


        const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("updated", tutor, student, doc);

        await emailTransporter.sendMail({
            from: emailAddress,
            to: tutor.email,
            subjectTutor,
            html: messageTutor
        });


        console.log("Meeting update email sent.");
    } catch (error) {
        console.error("Error sending meeting update email:", error);
    }
});

// 🔹 Pre-Delete Hook: Send Email When Meeting is Deleted
MeetingSchema.pre("findOneAndDelete", async function (next) {
    try {

        const meetingId = this.getQuery()._id; // Get the Meeting ID being deleted
        const meeting = await mongoose.model("Meeting").findById(meetingId);

        if (!meeting) return next();

        const tutor = await mongoose.model("Tutor").findById(meeting.tutor);
        const student = await mongoose.model("Student").findById(meeting.student);

        if (!tutor || !student) return next();

        const { subjectStudent, messageStudent } = meetingNotificationEmail("deleted", tutor, student, meeting);

        await emailTransporter.sendMail({
            from: emailAddress,
            to: student.email,
            subjectStudent,
            html: messageStudent
        });


        const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("deleted", tutor, student, meeting);

        await emailTransporter.sendMail({
            from: emailAddress,
            to: tutor.email,
            subjectTutor,
            html: messageTutor
        });


        console.log("Meeting cancellation email sent.");
        next();
    } catch (error) {
        console.error("Error sending meeting cancellation email:", error);
        next(error);
    }
});


const Meeting = mongoose.model('Meeting', MeetingSchema);
export default Meeting;

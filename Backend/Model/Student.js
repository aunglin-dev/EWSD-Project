import mongoose from "mongoose";
import { meetingNotificationEmailForTutor } from "../Service/emailTemplates.js";
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import roleTypes from "./roleType.js";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    DateOFBirth: {
      type: String,
      required: true,
    },
    NRC: {
      type: String,
      required: true,
    },
    PhNo: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);



studentSchema.pre('findOneAndDelete', async function (next) {
    try {
        const studentId = this.getQuery()._id; // Get the tutor ID being deleted
    
        const meetings = await mongoose.model("Meeting").find({ student: studentId });

        // Fetch student details before deletion
        const student = await mongoose.model("Student").findById(studentId);
        if (!student) return next(new Error("Student not found"));

        for (const meeting of meetings) {
            const tutor = await mongoose.model("Tutor").findById(meeting.tutor);
            if (tutor) {
                // Get email content
                const { subjectTutor, messageTutor } = meetingNotificationEmailForTutor("deleted", tutor, student, meeting);

                // Send email
                await emailTransporter.sendMail({
                    from: emailAddress,
                    to: tutor.email,
                    subjectTutor,
                    html: messageTutor
                });
            }
        }

        await mongoose.model("Meeting").deleteMany({ student: studentId }); // Remove related meetings

        next();
    } catch (error) {
        next(error);
    }
});



const Student = mongoose.model("Student", studentSchema);

export default Student;

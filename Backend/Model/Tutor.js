import mongoose from "mongoose";
import Meeting from "./Meeting.js";
import Student from "./Student.js";
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import { tutorRemovalEmail } from "../Service/emailTemplates.js";

const TutorSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

TutorSchema.pre("findOneAndDelete", async function (next) {
  try {
    //Deleting meeting when tutor deleted
    const tutorId = this.getQuery()._id; // Get the tutor ID being deleted
    await Meeting.deleteMany({ tutor: tutorId }); // Remove related meetings

    const tutor = await mongoose.model("Tutor").findById(tutorId);
    if (!tutor) return next();

    //Sending Email when tutor is deleted
    const students = await Student.find({ _id: { $in: tutor.students } });
    if (students.length > 0) {
      const studentEmails = students.map((student) => student.email);
      console.log("📧 Notifying students about tutor removal:", studentEmails);

      const emailContent = tutorRemovalEmail(tutor);

      const mailOptions = {
        from: emailAddress,
        to: studentEmails.join(","),
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      };

      // Send emails
      await emailTransporter.sendMail(mailOptions);
      console.log("✅ Tutor removal emails sent successfully.");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Tutor = mongoose.model("Tutor", TutorSchema);

export default Tutor;

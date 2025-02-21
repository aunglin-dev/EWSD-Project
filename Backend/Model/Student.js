import mongoose from "mongoose";
import { meetingNotificationEmailForTutor } from "../Service/emailTemplates.js";
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import roleTypes from "./roleType.js";

const studentSchema = new mongoose.Schema(
    {
    username: {
       type: String,
       required: true,
       unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
       type: String,
       required: true,
       unique: false,
    },
    role: {
        type: String,
        enum: roleTypes,
        default: "Student",
        required: false,
    }
  },
  { timestamps: true }
);


const Student = mongoose.model("Student", studentSchema);

export default Student;

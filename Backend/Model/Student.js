﻿import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const studentSchema = new mongoose.Schema(
    {
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
    },
    lastInteractionDate: {
        type: Date,
        default: Date.now,
    },
    lastLoginDate: { type: Date, default: null } 
  },
  { timestamps: true }
);


const Student = mongoose.model("Student", studentSchema);

export default Student;

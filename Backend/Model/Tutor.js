import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const TutorSchema = new mongoose.Schema(
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
      default: "Tutor",
      required: false,
    },
    lastLoginDate: { type: Date, default: null } 
  },
  { timestamps: true }
);


const Tutor = mongoose.model("Tutor", TutorSchema);

export default Tutor;

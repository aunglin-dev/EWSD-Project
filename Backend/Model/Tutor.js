import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const TutorSchema = new mongoose.Schema(
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
      default: "Tutor",
      required: false,
    }
  },
  { timestamps: true }
);


const Tutor = mongoose.model("Tutor", TutorSchema);

export default Tutor;

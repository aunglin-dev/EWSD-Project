import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Tutor from "../Model/Tutor.js";
import { tutorData } from "./seedingData.js";

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hash(password, 10);
  return hashedPassword;
};

export const seedTutors = async () => {
  try {
    // Check if there are already more than 10 students in the database
    const tutorCount = await Tutor.countDocuments();
    console.log(tutorCount)
    if (tutorCount >= 5) {
      console.log("There are already 5 or more tutor. Seeding aborted.");
      return; // Exit the function if more than 10 students exist
    }

    console.log("Seeding Tutors...");
    const tutorWithHashedPasswords = await Promise.all(
      tutorData.map(async (tutor) => {
        const hashedPassword = await hashPassword(tutor.password); // Hash the password
        return { ...tutor, password: hashedPassword }; // Replace plain password with hashed password
      })
    );
    await Tutor.deleteMany({});
    await Tutor.insertMany(tutorWithHashedPasswords);
    console.log("Tutors seeded successfully!");
  } catch (error) {
    console.error("Error seeding Tutors:", error);
  }
};

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Student from "../Model/Student.js";
import { studentData } from "./seedingData.js";

const hashPassword = async (password) => {
    const hashedPassword = bcrypt.hash(password, 10);
    return hashedPassword;
};

export const seedStudents = async () => {
    try {
        // Check if there are already more than 10 students in the database
        const studentCount = await Student.countDocuments();

        if (studentCount >= 10) {
            console.log("There are already 10 or more students. Seeding aborted.");
            return; // Exit the function if more than 10 students exist
        }
        const studentWithHashedPasswords = await Promise.all(
            studentData.map(async (student) => {
                const hashedPassword = await hashPassword(student.password) // Hash the password
                return { ...student, password: hashedPassword }; // Replace plain password with hashed password
            })
        );
        console.log("Seeding Students...");
        await Student.deleteMany({});
        await Student.insertMany(studentWithHashedPasswords); // Be sure to update data with valid tutor references
        console.log("Students seeded successfully!");
    } catch (error) {
        console.error("Error seeding Students:", error);
    }
};
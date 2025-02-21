import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Staff from "../Model/Staff.js";
import { staffData } from "./seedingData.js";

export const seedStaff = async () => {
    try {
        // Check if there are already 8 or more staff in the database
        const staffCount = await Staff.countDocuments();

        if (staffCount >= 5) {
            console.log("There are already 8 or more staff members. Seeding aborted.");
            return; // Exit the function if there are already 8 or more staff
        }

        console.log("Seeding Staff...");
        const staffWithHashedPasswords = await Promise.all(
            staffData.map(async (staff) => {
                const hashedPassword = await bcrypt.hash(staff.password, 10); // Await bcrypt hash properly
                return { ...staff, password: hashedPassword }; // Replace plain password with hashed password
            })
        );

        // Clean up the database and insert the new staff data
        await Staff.deleteMany({});
        await Staff.insertMany(staffWithHashedPasswords);
        console.log("Staff seeded successfully!");
    } catch (error) {
        console.error("Error seeding Staff:", error);
    }
};
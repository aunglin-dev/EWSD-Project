import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const staffSchema = new mongoose.Schema(
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
            default: "Staff",
            required: false,
        }
      
    },
    { timestamps: true }
);

// Pre-save hook to validate age
staffSchema.pre("save", function (next) {
    try {
        const today = new Date();
        const birthDate = new Date(this.DateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            const error = new Error("Staff member must be at least 18 years old.");
            throw error; // Throw error if under 18
        }

        next(); // Proceed if validation passes
    } catch (error) {
        next(error); // Pass any caught errors to the next middleware
    }
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;

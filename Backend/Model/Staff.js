import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
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
        role: {
            type: String,
            enum: ["admin", "staff", "coordinator"],
            required: true,
        },
        phNo: {
            type: String,
            required: true,
        },
        NRC: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        img: {
            type: String, // Store image URL or base64 string
        },
        DateOfBirth: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["Student", "Tutor", "Staff"],
            required: true,
        },
        allocationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Allocation",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        updatedDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

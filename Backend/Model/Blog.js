import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const blogSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: roleTypes,
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
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true } 
    }
);

// Virtual field to retrieve comments related to the blog post
blogSchema.virtual("comments", {
    ref: "BlogComment",  // Reference the BlogComment model
    localField: "_id",   // Match _id of Blog
    foreignField: "blogId", // Match blogId field in BlogComment
    justOne: false       // Retrieve multiple comments
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

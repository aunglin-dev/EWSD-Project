import mongoose from "mongoose";

const blogCommentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    role: {
        type: String,
        enum: ["Tutor", "Student", "Staff"], 
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const BlogComment = mongoose.model("BlogComment", blogCommentSchema);

export default BlogComment;

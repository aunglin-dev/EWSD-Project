import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const documentCommentSchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Document model
            ref: "Document",
            required: true,
        },
        role: {
            type: String,
            enum: roleTypes,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const DocumentComment = mongoose.model("DocumentComment", documentCommentSchema);
export default DocumentComment;

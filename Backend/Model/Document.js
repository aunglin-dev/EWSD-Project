import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const documentSchema = new mongoose.Schema(
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
        docType: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true } 
    } 
);


// Virtual field to retrieve comments related to the document
documentSchema.virtual("comments", {
    ref: "DocumentComment",   // Reference the DocumentComment model
    localField: "_id",        // Match _id of Document
    foreignField: "documentId", // Match documentId field in DocumentComment
    justOne: false            // Retrieve multiple comments
});


const Document = mongoose.model("Document", documentSchema);

export default Document;

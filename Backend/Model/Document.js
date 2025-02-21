import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
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
    { timestamps: true } 
);

const Document = mongoose.model("Document", documentSchema);

export default Document;

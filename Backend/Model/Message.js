import mongoose from "mongoose";
import roleTypes from "./roleType.js";

const messageSchema = new mongoose.Schema(
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
        text: {
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


messageSchema.pre("save", async function (next) {
    try {
        const allocation = await mongoose.model("Allocation").findById(this.allocationId);
        if (!allocation) {
            return next(new Error("Invalid allocation ID: Allocation not found"));
        }
        next();
    } catch (error) {
        next(error);
    }
});


const Message = mongoose.model("Message", messageSchema);

export default Message;




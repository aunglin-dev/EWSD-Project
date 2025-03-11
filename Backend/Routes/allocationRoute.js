import express from "express";
import {
    createAllocation,
    getAllAllocations,
    getAllocationById,
    updateAllocation,
    deleteAllocation,
    getAllocationsByTutorId
} from "../Controller/allocationController.js";

const allocationRouter = express.Router();

// Define allocation routes
allocationRouter.get("/", getAllAllocations); // Get all allocations
allocationRouter.get("/:id", getAllocationById); // Get an allocation by ID
allocationRouter.get("/tutor/:tutorId", getAllocationsByTutorId); // Get allocations by tutorId

allocationRouter.post("/", createAllocation); // Create an allocation

allocationRouter.put("/:id", updateAllocation); // Update an allocation

allocationRouter.delete("/:id", deleteAllocation); // Delete an allocation



export default allocationRouter;

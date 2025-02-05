import express from "express";
import {
    createAllocation,
    getAllAllocations,
    getAllocationById,
    updateAllocation,
    deleteAllocation
} from "../Controller/allocationController.js";

const allocationRouter = express.Router();

// Define allocation routes
allocationRouter.post("/", createAllocation);
allocationRouter.get("/", getAllAllocations);
allocationRouter.get("/:id", getAllocationById);
allocationRouter.put("/:id", updateAllocation);
allocationRouter.delete("/:id", deleteAllocation);

export default allocationRouter;

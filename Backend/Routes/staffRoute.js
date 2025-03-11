import express from "express";
import { createStaff, getAllStaff, getStaffById, updateStaff, deleteStaff } from "../Controller/staffController.js";
import meetingRouter from "./meetingRoute.js";
import studentRouter from "./studentRoute.js";
import tutorRouter from "./tutorRoute.js";
import allocationRouter from "./allocationRoute.js";

const staffRouter = express.Router();



// Nested routers: allowing staff to access other resources like meetings, students, and tutors
staffRouter.use("/meetings", meetingRouter);
staffRouter.use("/students", studentRouter);
staffRouter.use("/tutors", tutorRouter);
staffRouter.use("/allocations", allocationRouter);



//Staff Router
staffRouter.get("/", getAllStaff); // Get all staff
staffRouter.get("/:id", getStaffById); // Get a staff by ID

staffRouter.post("/", createStaff); // Create a staff

staffRouter.put("/:id", updateStaff); // Update a staff

staffRouter.delete("/:id", deleteStaff); // Delete a staff


export default staffRouter;

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
staffRouter.post("/", createStaff);
staffRouter.get("/", getAllStaff);
staffRouter.get("/:id", getStaffById);
staffRouter.put("/:id", updateStaff);
staffRouter.delete("/:id", deleteStaff);


export default staffRouter;

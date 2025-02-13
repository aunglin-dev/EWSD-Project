import express from "express";
import { createStaff, getAllStaff, getStaffById, updateStaff, deleteStaff } from "../Controller/staffController.js";
import meetingRouter from "./meetingRoute.js";
import studentRouter from "./studentRoute.js";
import tutorRouter from "./tutorRoute.js";


const staffRouter = express.Router();



// Nested routers: allowing staff to access other resources like meetings, students, and tutors
staffRouter.use("/meeting", meetingRouter);
staffRouter.use("/student", studentRouter);
staffRouter.use("/tutor", tutorRouter);



//Staff Router
staffRouter.post("/", createStaff);
staffRouter.get("/", getAllStaff);
staffRouter.get("/:id", getStaffById);
staffRouter.put("/:id", updateStaff);
staffRouter.delete("/:id", deleteStaff);


export default staffRouter;

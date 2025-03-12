import express from "express";
import authMiddleware from "../Middleware/auth.js";
import { logActivity } from "../Controller/userActivityController.js";

const activityRouter = express.Router();

//Student Login
activityRouter.post("/",authMiddleware, logActivity);


export default activityRouter;

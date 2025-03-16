import express from "express";
import authMiddleware from "../Middleware/auth.js";
import { getAll, getAllByPage, logActivity, mostActiveUser, mostViewPage } from "../Controller/userActivityController.js";

const activityRouter = express.Router();

//Student Login
activityRouter.post("/",authMiddleware, logActivity);
activityRouter.get("/", getAll);
activityRouter.get("/page/:page",getAllByPage)
activityRouter.get("/mostViewPage", mostViewPage)
activityRouter.get("/mostActiveUser", mostActiveUser)





export default activityRouter;

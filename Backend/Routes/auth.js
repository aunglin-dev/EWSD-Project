import express from "express";
import {getMe, signin } from "../Controller/auth.js";
import authMiddleware from "../Middleware/auth.js";

const Router = express.Router();

//Student Login
Router.post("/signin", signin);

Router.post("/me", authMiddleware, getMe)

export default Router;

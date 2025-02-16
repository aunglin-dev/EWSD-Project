import express from "express";
import { signin } from "../Controller/auth.js";
import authMiddleware from "../Middleware/auth.js";

const Router = express.Router();

//Student Login
Router.post("/signin", signin);

Router.post("/me", authMiddleware);

export default Router;

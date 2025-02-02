import express from "express";
import { signup, signin } from "../Controller/auth.js";

const Router = express.Router();

//Student Register
Router.post("/signup", signup);

//Student Login
Router.post("/signin", signin);

export default Router;

import AuthRouter from "./Routes/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

//Connection TO Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("ok");
  })
  .catch((err) => console.log("error", err.message));

//Middleware
app.use(cookieParser());
app.use(express.json());

//Routers
app.use("/api/auth", AuthRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something's wrong";
  res.status(status).json({
    success: false,
    status,
    message,
  });
});

//Running Port
app.listen(8000, () => {
  console.log("Port is running on Localhost : 8000");
});

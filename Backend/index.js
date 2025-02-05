import AuthRouter from "./Routes/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

//Seeder
import seeder from "./Seeders/seeder.js";


//Allocation Related Router
import allocationRouter from './Routes/allocationRoute.js';
import tutorRouter from './Routes/tutorRoute.js';
import meetingRouter from './Routes/meetingRoute.js';
import studentRouter from './Routes/studentRoute.js';
import staffRouter from "./Routes/staffRoute.js";


dotenv.config();
const app = express();


mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connection error:", err.message));

    seeder();
    console.log(process.env.MONGODB_URI);

//Middleware
app.use(cookieParser());
app.use(express.json());

//Routers
app.use("/staff", staffRouter);
app.use("/api/auth", AuthRouter);
app.use('/tutors', tutorRouter);
app.use('/meetings', meetingRouter);
app.use('/students', studentRouter);
app.use('allocations', allocationRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong.";
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


export default app; 
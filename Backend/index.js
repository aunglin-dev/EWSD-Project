import AuthRouter from "./Routes/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
//Seeder
import seeder from "./Seeders/seeder.js";

//controller
import { setupSocketListeners } from "./Controller/messageController.js";


//Allocation Related Router
import allocationRouter from "./Routes/allocationRoute.js";
import tutorRouter from "./Routes/tutorRoute.js";
import meetingRouter from "./Routes/meetingRoute.js";
import studentRouter from "./Routes/studentRoute.js";
import staffRouter from "./Routes/staffRoute.js";
import { messageRouter } from "./Routes/messageRoute.js";
import documentRouter from "./Routes/documentRoute.js";
import documentCommentRouter from "./Routes/documentCommentRoute.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
    },
});
app.set("io", io);

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connection error:", err.message));

seeder();
console.log(process.env.MONGODB_URI);

//Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files as static assets

//Routers
app.use("/api/staff", staffRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/students", studentRouter);
app.use("/api/allocations", allocationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/documents", documentRouter);
app.use("/api/documentcomments", documentCommentRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong.";
    res.status(status).json({
        success: false,
        status,
        message,
    });
});

setupSocketListeners(io);

//Running Port
server.listen(8000, () => {
    console.log("Port is running on Localhost : 8000");
});

export default app;
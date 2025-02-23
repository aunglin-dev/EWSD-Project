import AuthRouter from "./Routes/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cron from 'node-cron';
import { Worker } from 'worker_threads';

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
import blogRouter from "./Routes/blogRoute.js";
import blogCommentRouter from "./Routes/blogCommentRoute.js";

dotenv.config();

//Initialize Express
const app = express();


//Initialize Server
const server = http.createServer(app);

// Set up socket.io server
const io = new Server(server,{
    cors: {
        origin: "*",
    },
});
app.set("io", io);


//Connect to MongoDB
console.log(process.env.MONGODB_URI);
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connection error:", err.message));



// Seed Database
seeder();



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
app.use("/api/blogs", blogRouter);
app.use("/api/blogcomments", blogCommentRouter);


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong.";
    res.status(status).json({
        success: false,
        status,
        message,
    });
});


// Set up socket.io listeners For Message Between Tutor and Student
setupSocketListeners(io);



// Create the worker once and keep it running
let worker;

// Function to start the email worker
const startWorker = () => {
    if (!worker) {
        worker = new Worker(new URL('./Service/lastInteractionEmailWorker.js', import.meta.url));

        worker.on('message', (message) => {
            console.log('Worker Message:', message.status);
        });

        worker.on('error', (error) => {
            console.error('Error from worker:', error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.log(`Worker stopped with exit code ${code}`);
            }
        });
    } else {
        console.log("Email worker already created!")
    }
};


try {
    startWorker();
} catch (err) {
    console.error('Error starting worker:', err);
    worker = null;
}

// Send a message to the worker every minute
cron.schedule('*/1 * * * *', () => {
    try {
        console.log('Sending message to worker every 1 minute...');
        if (worker) {
            worker.postMessage({ action: 'startTask' });  // Send a message to the worker to start the task
        } else {
            console.error('Worker is not initialized');
        }
    } catch (error) {
        console.error('Error sending message to worker:', error);
    }
});

//Running Port
server.listen(8000, () => {
    console.log("Port is running on Localhost : 8000");
});


export default app;
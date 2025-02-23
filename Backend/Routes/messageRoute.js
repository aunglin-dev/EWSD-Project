import express from "express";
import {
    sendMessage,
    getMessages
} from "../Controller/messageController.js";


export const messageRouter = express.Router();

// Route to send a message
messageRouter.post("/", sendMessage);

// Route to get messages by allocationId
messageRouter.get("/:allocationId", getMessages);

export default messageRouter;



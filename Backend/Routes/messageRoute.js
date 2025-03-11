import express from "express";
import {
    sendMessage,
    getMessages,
    deleteMessage,
    deleteAllMessages,
    updateMessage
} from "../Controller/messageController.js";


export const messageRouter = express.Router();

// Route to send a message
messageRouter.post("/", sendMessage);

// Route to get messages by allocationId
messageRouter.get("/:allocationId", getMessages);


// Route to update a message by messageId
messageRouter.put("/message/:messageId", updateMessage);

// Route to delete a specific message by messageId
messageRouter.delete("/message/:messageId", deleteMessage);

// Route to delete all messages by allocationId
messageRouter.delete("/:allocationId", deleteAllMessages);

export default messageRouter;



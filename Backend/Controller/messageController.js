
import Message from '../Model/Message.js';
import Allocation from "../Model/Allocation.js";



const sendMessage = async (req, res) => {
    try {
        const { role, allocationId, text } = req.body;

        const message = new Message({ role, allocationId, text });
        await message.save();

        // Emit the new message to clients in the allocation room
        req.app.get("io").to(allocationId.toString()).emit("receiveMessage", message);

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const messages = await Message.find({ allocationId }).sort({ createdAt: 1 });
        if (!messages.length) {
            return res.status(404).json({ error: "No messages found for this role and allocation ID" });
        }
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByIdAndDelete(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        req.app.get("io").to(message.allocationId.toString()).emit("messageDeleted", messageId);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAllMessages = async (req, res) => {
    try {
        const { allocationId } = req.params;
        await Message.deleteMany({ allocationId });
        req.app.get("io").to(allocationId.toString()).emit("allMessagesDeleted", allocationId);
        res.status(200).json({ message: "All messages deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const message = await Message.findByIdAndUpdate(messageId, { text }, { new: true });
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        req.app.get("io").to(message.allocationId.toString()).emit("messageUpdated", message);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const setupSocketListeners = (io) => {
    try {
        io.on("connection", async (socket) => {

            console.log("User connected", socket.id);

            socket.on("joinRoom", async (allocationId) => {
                try {
                    const allocation = await Allocation.findById(allocationId);
                    if (!allocation) {
                        throw new Error("You are not allocated to this tutor/student, so you cannot send a message.");
                    }

                    socket.join(allocationId);
                    socket.emit("success", { message: 'User joined room: ${allocationId}' });
                    console.log(`User joined room: ${allocationId}`);
                } catch (error) {
                    console.error("Error sending message:", error);
                    socket.emit("error", { message: error.message });
                }
            });


            socket.on("leaveRoom", async (allocationId) => {
                try {
                    const allocation = await Allocation.findById(allocationId);
                    if (!allocation) {
                        throw new Error("You are not allocated to this tutor/student.");
                    }
                    socket.leave(allocationId);
                    socket.emit("success", { message: `User left room: ${allocationId}` });
                    console.log(`User left room: ${allocationId}`);
                } catch (error) {
                    console.error("Error sending message:", error);
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("sendMessage", async (data) => {
                try {
                    const { role, allocationId, text } = data;

                    const allocation = await Allocation.findById(allocationId);
                    if (!allocation) {
                        throw new Error("You are not allocated to this tutor/student, so you cannot send a message.");
                    }

                    const message = new Message({ role, allocationId, text });
                    await message.save();

                    console.log(`sendMessage: ${message}`);

                    io.to(allocationId.toString()).emit("receiveMessage", message);
                } catch (error) {
                    console.error("Error sending message:", error);
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("deleteAllMessages", async (allocationId) => {
                try {
                    await Message.deleteMany({ allocationId });
                    io.to(allocationId.toString()).emit("allMessagesDeleted", allocationId);
                } catch (error) {
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("deleteMessage", async (messageId) => {
                try {
                    const message = await Message.findByIdAndDelete(messageId);
                    if (!message) {
                        throw new Error("Message not found");
                    }
                    io.to(message.allocationId.toString()).emit("messageDeleted", messageId);
                } catch (error) {
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("updateMessage", async (data) => {
                try {
                    const { messageId, text } = data;
                    const message = await Message.findByIdAndUpdate(messageId, { text }, { new: true });
                    if (!message) {
                        throw new Error("Message not found");
                    }
                    io.to(message.allocationId.toString()).emit("messageUpdated", message);
                } catch (error) {
                    socket.emit("error", { message: error.message });
                }
            });



            socket.on("fetchMessages", async (allocationId) => {
                try {
                    const allocation = await Allocation.findById(allocationId);
                    if (!allocation) {
                        throw new Error("You are not allocated to this tutor/student, so you cannot receive messages.");
                    }

                    const messages = await Message.find({ allocationId }).sort({ createdAt: 1 });
                    console.log(`fetchMessages: ${messages}`);
                    socket.emit("allMessages", messages);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    socket.emit("error", { message: error.message });
                }
            });

            socket.on("disconnect", () => {
                try {
                    console.log("User disconnected", socket.id);
                } catch (error) {
                    console.error("Error during disconnect:", error);
                    socket.emit("error", { message: "An error occurred during disconnection." });
                }
            });
        });
    } catch (error) {
        console.log("Failed in connecting to Socket IO");
    }
};

export { sendMessage, getMessages, deleteMessage, deleteAllMessages, updateMessage, setupSocketListeners };

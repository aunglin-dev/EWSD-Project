
import Message from '../Model/Message.js';
import Allocation from "../Model/Allocation.js";



const sendMessage = async (req, res) => {
    try {
        const { role, allocationId, text } = req.body;

        const message = new Message({ role, allocationId, text });
        await message.save();

        // Emit the new message to clients in the allocation room
        req.app.get("io").to(allocationId.toString()).emit("newMessage", message);

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const messages = await Message.find({ allocationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const setupSocketListeners = (io) => {
    try {
        io.on("connection", async (socket) => {

            console.log("User connectedd", socket.id);

            socket.on("joinRoom", async (allocationId) => {
                try {
                    const allocation = await Allocation.findById(allocationId);
                    if (!allocation) {
                        throw new Error("You are not allocated to this tutor/student, so you cannot send a message.");
                    }

                    socket.join(allocationId);
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

                    io.to(allocationId.toString()).emit("newMessage", message);
                } catch (error) {
                    console.error("Error sending message:", error);
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

export { sendMessage, getMessages, setupSocketListeners };

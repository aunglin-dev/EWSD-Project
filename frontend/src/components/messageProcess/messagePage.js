import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoginUserSide from "./login-user-side";
import OtherMessageParty from "./otherMessageParty";
import AttachmentIcon from "@mui/icons-material/Attachment";

const socket = io("http://localhost:8000");

export default function MessagePage() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allocationId, setAllocationId] = useState("67c3592ed5f5651e2799502e");
  const [role, setRole] = useState("Student");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/messages/${allocationId}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    socket.emit("joinRoom", allocationId);

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", allocationId);
    };
  }, [allocationId]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    axios
      .post("http://localhost:8000/api/messages", {
        allocationId,
        role,
        text: newMessage,
      })
      .then(() => {
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    // socket.emit('sendMessage', {
    //   allocationId,
    //   role,
    //   text: newMessage,
    // });
    // setNewMessage('');
  };

  return (
    <div style={{}}>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <LoginUserSide />
        {/* middle part start */}
        <Box
          sx={{
            flexGrow: 1,
            height: "500px",
            overflowY: "auto",
            padding: "10px",
            borderRight: "1px solid #ccc",
          }}
        >
          {messages.map((message) => (
            <Box
              key={message._id}
              sx={{
                display: "flex",
                flexDirection: message.role === role ? "row-reverse" : "row",
                marginBottom: "10px",
              }}
            >
              {/* timeStapm */}
              <Typography
                variant="caption"
                sx={{
                  alignSelf: "flex-start",
                  color: "#888",
                  marginBottom: "5px",
                }}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </Typography>

              {/* msg bubble */}
              <Box
                sx={{
                  backgroundColor:
                    message.role === role ? "#DCF8C6" : "#ECECEC",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                }}
              >
                <Typography>{message.text}</Typography>
                {message.file && (
                  <Box sx={{ marginTop: "5px" }}>
                    <AttachmentIcon
                      sx={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    <Typography variant="body2">{message.file.name}</Typography>
                  </Box>
                )}
              </Box>

              {/* cmt btn */}
              <Button
                variant="text"
                size="small"
                sx={{ alignSelf: "flex-end", marginLeft: "10px" }}
              >
                Comment
              </Button>
            </Box>
          ))}
        </Box>
        {/* middle part end  */}

        <OtherMessageParty />
      </Box>

      {/* input field and send button */}
      <Box sx={{ display: "flex" }}>
        <TextField
          value={newMessage}
          type="text"
          onChange={(e) => setNewMessage(e.target.value)}
          id="messageInput"
          label="Enter Message"
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{ marginLeft: "10px" }}
        >
          Send
        </Button>
      </Box>
    </div>
  );
}

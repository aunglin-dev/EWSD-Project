import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Box, Button, TextField, Typography, Paper, useMediaQuery } from "@mui/material";
import LoginUserSide from "./login-user-side";
import OtherMessageParty from "./otherMessageParty";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { useSelector } from "react-redux";

const socket = io("http://localhost:8000");

export default function MessagePage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  //console.log("current user allocation id =>", currentUser?.allocations[0].id);
  //console.log("current user roel=>", currentUser?.role);
  const hasAllocations =
    currentUser?.allocations && currentUser.allocations.length > 0;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allocationId, setAllocationId] = useState(
    hasAllocations ? currentUser.allocations[0].id : null
  );
  const [role, setRole] = useState(currentUser?.role);
  const chatBoxRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!hasAllocations) {
      console.log("User has no allocations.");
      return;
    }
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
    socket.on("typing", ({ role }) => {
      setIsTyping(true);
    });

    socket.on("stopTyping", ({ role }) => {
      setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.emit("leaveRoom", allocationId);
    };
  }, [allocationId, hasAllocations]);

  const handleSend = () => {
    console.log("msg sent ");
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

  // messages to scrooll bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", { allocationId, role });
  };

  const handleInputBlur = () => {
    socket.emit("stopTyping", { allocationId, role });
  };

  if (!hasAllocations) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: "500px", textAlign: "center" }}
        >
          <Typography variant="h5" gutterBottom>
            No Allocations Found
          </Typography>
          <Typography severity="warning" sx={{ mb: 2 }}>
            You have not been allocated with anyone yet.
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Please contact your administrator to get assigned to a tutor or
            student.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      paddingTop="80px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign={"center"}
        sx={{ padding: "10px", borderBottom: "1px solid #ccc" }}
      >
        Message Room
      </Typography>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <LoginUserSide />
        {/* middle part start */}
        <Box
          ref={chatBoxRef}
          sx={{
            flexGrow: 1,
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
                flexDirection: message.role === role ? "row" : "row-reverse",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: message.role === role ? "flex-start" : "flex-end",
                }}
              >
                {/* time Stapm */}
                <Typography
                  variant="caption"
                  sx={{
                    alignSelf: "flex-start",
                    color: "#888",
                    marginBottom: "5px",
                  }}
                >
                  {/* {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} */}
                  {new Date(message.updatedDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                  {/* {message.file && (
                  <Box sx={{ marginTop: "5px" }}>
                    <AttachmentIcon
                      sx={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    <Typography variant="body2">{message.file.name}</Typography>
                  </Box>
                )} */}
                </Box>

                {/* cmt btn */}
                {/* <Button
                variant="text"
                size="small"
                sx={{
                  alignSelf: "flex-end",
                  marginLeft: "10px",
                  textTransform: "none",
                }}
              >
                Reply
              </Button> */}
              </Box>
            </Box>
          ))}
          {isTyping && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ textAlign: "center", marginTop: "10px" }}
            >
              Typing...
            </Typography>
          )}
        </Box>
        {/* middle part end  */}

        <OtherMessageParty />
      </Box>

      {/* input field and send button */}
      <Box
        sx={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
          position: "sticky",
          bottom: 0,
        }}
      >
        <TextField
          value={newMessage}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          id="messageInput"
          label="Enter Message"
          variant="outlined"
          fullWidth
          sx={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{ whiteSpace: "nowrap" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

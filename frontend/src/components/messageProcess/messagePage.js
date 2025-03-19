import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import LoginUserSide from "./login-user-side";
import OtherMessageParty from "./otherMessageParty";
import { useSelector } from "react-redux";
import axiosInstance from "../../Services/AxiosInstance";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const socket = io("http://localhost:8000");

export default function MessagePage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  console.log("current user=>", currentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const [otherPartyId, setOtherPartyId] = useState(null);
  const [allocationId, setAllocationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [role, setRole] = useState(currentUser?.role);
  const chatBoxRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (location.state && location.state.otherPartyId) {
      setOtherPartyId(location.state.otherPartyId);
    } else {
      console.error("no otherParty id found");
    }
  }, [location]);

  useEffect(() => {
    if (currentUser && currentUser.allocations.length > 0) {
      const allocation = currentUser.allocations.find(
        (allocation) =>
          allocation.student === otherPartyId ||
          allocation.tutor === otherPartyId
      );
      if (allocation) {
        setAllocationId(allocation.id);
      }
    }
  }, [currentUser, otherPartyId]);
  //console.log("allocatin id=>", allocationId);
  useEffect(() => {
    if (!allocationId) return;

    axiosInstance
      .get(`http://localhost:8000/api/messages/${allocationId}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("error fetching messages=>", error);
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
  }, [allocationId]);

  const handleSend = () => {
    console.log("msg sent ");
    if (newMessage.trim() === "") return;
    axiosInstance
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
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    } else {
      setNewMessage(e.target.value);
      socket.emit("typing", { allocationId, role });
    }
  };

  const handleInputBlur = () => {
    socket.emit("stopTyping", { allocationId, role });
  };

  return (
    <Box
      paddingTop="80px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <IconButton onClick={() => navigate(-1)} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          gutterBottom
          textAlign={"center"}
          sx={{ flexGrow: 1, marginLeft: "10px" }}
        >
          Message Room
        </Typography>
      </Box>
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
                </Box>
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
          multiline
          rows={1}
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

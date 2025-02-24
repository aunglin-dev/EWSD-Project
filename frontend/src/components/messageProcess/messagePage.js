import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Box, Button, TextField } from '@mui/material';

const socket = io('http://localhost:8000');

export default function MessagePage() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [allocationId, setAllocationId] = useState('67b23e07dcfe1abaddc68560');
  const [role, setRole] = useState('Student')

  useEffect(() => {
    axios.get(`http://localhost:8000/api/messages/${allocationId}`)
      .then((response) => {
        setMessages(response.data);
      });

    // Join the allocation room
    socket.emit('joinRoom', allocationId);

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', allocationId);
    };
  }, [allocationId]);




  const handleSend = () => {
    axios.post('http://localhost:8000/api/messages', {
      allocationId: allocationId,
      role,
      text: newMessage,
    });
    // socket.emit('sendMessage', {
    //   allocationId: allocationId,
    //   role,
    //   text: newMessage,});
    setNewMessage('');
  }

  return (
    <>
    <h1>Chat</h1>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <strong>{message.role}:</strong> {message.text}
          </div>
        ))}
      </div>
      <Box sx={{display: 'flex'}}>
      <TextField value={newMessage} type='text' onChange={(e) => setNewMessage(e.target.value)} id="messageInput" label="Enter Message" variant="outlined" />
      <Button variant='contained' onClick={handleSend}>Send</Button>
      </Box>
      

    </>
  );
}

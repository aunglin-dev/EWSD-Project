import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function MessageListPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        if (currentUser.allocations.length === 0) return;

        const studentPromises = currentUser.allocations.map(
          async (allocation) => {
            const response = await axios.get(
              `http://localhost:8000/api/students/${allocation.student}`
            );
            return {
              ...response.data,
              createdAt: allocation.createdAt,
            };
          }
        );

        const studentData = await Promise.all(studentPromises);
        setStudents(studentData);
      } catch (error) {
        console.error("fail fetch student data", error);
      }
    };

    if (currentUser && currentUser.allocations.length > 0) {
      fetchStudentDetail();
    }
  }, [currentUser]);

  const hasAllocations = currentUser.allocations.length > 0;
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
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom marginTop={10}>
        Chat List
      </Typography>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {students.map((student, index) => (
          <ListItem
            key={index}
            button
            component={Link}
            to="/tutor/message-chat"
            state={{ otherPartyId: student._id }}
            sx={{
              "&:hover": {
                backgroundColor: "#eaeaea",
                transition: "background-color 0.3s ease",
              },
            }}
          >
            <ListItemText
              primary={student.name}
              secondary={`role : ${student.role}`}
            />
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ fontSize: "0.8rem", fontStyle: "italic" }}
            >
              {new Date(student.createdAt).toLocaleDateString()}{" "}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/AxiosInstance.js";
import { useSelector } from "react-redux";

export default function MeetingTutor() {
  const { currentUser } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllocatedStudents = async () => {
      const allocations = currentUser?.allocations || [];
      const studentPromises = allocations.map((allocation) =>
        fetchStudentDetails(allocation.student)
      );
      const studentDetails = await Promise.all(studentPromises);
      setStudents(studentDetails.filter((student) => student !== null));
      setLoading(false);
    };
    fetchAllocatedStudents();
  }, [currentUser]);

  const handleStudentClick = (student) => {
    navigate(`/tutor/meeting/${student._id}`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box paddingY="50px" paddingX="20px">
      <Box marginY="40px">
        <Typography variant="h2">Students</Typography>
        <Typography variant="subtitle1">Select to view meetings</Typography>
      </Box>

      <List>
        {students.length > 0 ? (
          students.map((student) => (
            <ListItem
              key={student._id}
              button
              onClick={() => handleStudentClick(student)}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "10px",
                "&:hover": { backgroundColor: "#eaeaea" },
              }}
            >
              <ListItemText primary={student.name} />
            </ListItem>
          ))
        ) : (
          <Typography>No students assigned</Typography>
        )}
      </List>
    </Box>
  );
}

const fetchStudentDetails = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8000/api/students/${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching student ${studentId}:`, error);
    return null;
  }
};

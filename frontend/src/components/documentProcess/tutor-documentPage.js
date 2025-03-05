import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  useMediaQuery
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommentIcon from "@mui/icons-material/Comment";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { useSelector } from "react-redux";

export default function DocumentPage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [documents, setDocuments] = useState([]);

  //fetch allocations, student names, documents
  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const allocations = currentUser?.allocations || [];
        if (allocations.length === 0) {
          console.log("User has no allocations");
          return;
        }

        const fetchedStudents = await Promise.all(
          allocations.map(async (allocation) => {
            try {
              const studentResponse = await axios.get(
                `http://localhost:8000/api/students/${allocation.student}`
              );
              const studentName = studentResponse.data.name;
              const documentsResponse = await axios.get(
                `http://localhost:8000/api/documents/allocation/${allocation.id}`
              );
              const lastSubmissionDate =
                documentsResponse.data.length > 0
                  ? new Date(
                    documentsResponse.data[0].createdAt
                  ).toLocaleDateString()
                  : "No submissions yet";

              return {
                id: allocation.student,
                name: studentName,
                allocationId: allocation.id,
                lastSubmissionDate,
              };
            } catch (error) {
              console.error("Error fetching student or documents:", error);
              return null;
            }
          })
        );

        const validStudents = fetchedStudents.filter(
          (student) => student !== null
        );
        setStudents(validStudents);
      } catch (error) {
        console.error("Error fetching allocations:", error);
        alert(
          "An error occurred while fetching allocations. Please try again."
        );
      }
    };

    fetchAllocations();
  }, [currentUser]);

  const fetchDocuments = async (allocationId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/documents/allocation/${allocationId}`
      );

      const fetchedDocuments = response.data.map((doc) => ({
        id: doc._id,
        fileName: doc.description,
        submissionDate: new Date(doc.createdAt).toLocaleDateString(),
        url: doc.url,
        comments: doc.comments || [],
      }));

      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("An error occurred while fetching documents. Please try again.");
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    fetchDocuments(student.allocationId);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = url.split("/").pop();
    link.click();
  };

  const renderStudentList = () => (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Students
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem
            key={student.id}
            button
            onClick={() => handleStudentClick(student)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText
              primary={student.name}
              secondary={`Last Submission: ${student.lastSubmissionDate}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  const renderDocumentList = () => (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => setSelectedStudent(null)}
        sx={{ mb: 2 }}
      >
        Back to Students
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Documents from {selectedStudent?.name}
        </Typography>
        <List>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <ListItem key={doc.id} divider>
                <ListItemText
                  primary={doc.fileName}
                  secondary={`Submitted on ${doc.submissionDate}`}
                />
                <IconButton
                  edge="end"
                  aria-label="download"
                  onClick={() => handleDownload(doc.url)}
                  sx={{ marginRight: "10px" }}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton edge="end" aria-label="comment">
                  <CommentIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No documents submitted yet
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
      sx={{ display: "flex", flexDirection: "column" }}>
      {selectedStudent ? renderDocumentList() : renderStudentList()}
    </Box>
  );
}

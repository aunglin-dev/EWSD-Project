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
  useMediaQuery,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommentIcon from "@mui/icons-material/Comment";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axiosInstance from "../../services/AxiosInstance";

export default function DocumentPage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

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
              const studentResponse = await axiosInstance.get(
                `http://localhost:8000/api/students/${allocation.student}`
              );
              const studentName = studentResponse.data.name;
              const documentsResponse = await axiosInstance.get(
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
      const response = await axiosInstance.get(
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

  const handleAddComment = async () => {
    if (!commentInput.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    try {
      console.log("current user role =>", currentUser?.role);
      console.log("doc id =>", selectedDocumentId);
      console.log("comment input=>", commentInput);
      const response = await axiosInstance.post(
        "http://localhost:8000/api/documentcomments",
        {
          role: currentUser?.role,
          documentId: selectedDocumentId,
          comment: commentInput,
        }
      );

      setCommentInput("");
      setSelectedDocumentId(null);
      fetchDocuments(selectedStudent.allocationId);
      alert("comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(`Error: ${error.response?.data?.message || "Please try again."}`);
    }
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
            documents.map((doc, index) => (
              <div
                key={doc.id}
                style={{ borderBottom: "1px solid #1399c2", margin: 1 }}
              >
                <ListItem divider>
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
                  <IconButton
                    edge="end"
                    aria-label="comment"
                    onClick={() => setSelectedDocumentId(doc.id)}
                  >
                    <CommentIcon />
                  </IconButton>
                </ListItem>
                {/* show document comment */}
                {doc.comments.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    {doc.comments.map((cmt, index) => {
                      const formattedDate = dayjs(cmt.createdAt).format(
                        "DD-MM-YYYY, hh:mm A"
                      );

                      return (
                        <div>
                          <Typography
                            key={index}
                            variant="caption"
                            color="textSecondary"
                          >
                            Comment
                            <span
                              style={{
                                backgroundColor: "#f2dbb1",
                                borderRadius: "14px",
                                padding: "3px 5px",
                                fontSize: "10px",
                              }}
                            >
                              {formattedDate}
                            </span>{" "}
                            ={" "}
                            <span
                              style={{ fontWeight: "bold", fontSize: "15px" }}
                            >
                              {cmt.comment}
                            </span>
                          </Typography>
                          <br />
                        </div>
                      );
                    })}
                  </Box>
                )}
              </div>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No documents submitted yet
            </Typography>
          )}
        </List>
      </Paper>

      {/* show comment of selected document */}
      {selectedDocumentId && (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add Comment
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Enter your comment here..."
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            sx={{ mr: 2 }}
          >
            Submit Comment
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setSelectedDocumentId(null);
              setCommentInput("");
            }}
          >
            Cancel
          </Button>
        </Paper>
      )}
    </Box>
  );

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {selectedStudent ? renderDocumentList() : renderStudentList()}
    </Box>
  );
}

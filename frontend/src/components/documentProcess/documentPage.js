import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  useMediaQuery
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { useSelector } from "react-redux";

export default function DocumentPage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  const role = currentUser?.role;
  const allocationId = currentUser?.allocations[0]?.id;

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/documents/allocation/${allocationId}`
        );

        console.log("API Response:", response.data);

        const fetchedSubmissions = response.data.map((doc) => ({
          id: doc._id,
          fileName: doc.description,
          submissionDate: new Date(doc.createdAt).toLocaleDateString(),
          status: "Pending",
          url: doc.url,
          comments: doc.comments || [],
        }));

        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        // alert(
        //   "An error occurred while fetching submissions. Please try again."
        // );
      }
    };

    fetchSubmissions();
  }, [allocationId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("allocationId", allocationId);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);
      const newSubmission = {
        id: response.data._id,
        fileName: file.name,
        submissionDate: new Date(response.data.createdAt).toLocaleDateString(),
        status: "Pending",
        url: response.data.url,
        comments: [],
      };

      setSubmissions((prevSubmissions) => [...prevSubmissions, newSubmission]);
      setFile(null);
      setDescription("");
      alert("File submitted successfully!");
    } catch (error) {
      console.error("Error submitting file:", error);
      alert("An error occurred while submitting the file. Please try again.");
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = url.split("/").pop();
    link.click();
  };

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
      sx={{ display: "flex", flexDirection: "column" }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Proposal Submission
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Due December 15, 2024 11:59 PM
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1">
          <strong>Instructions:</strong> Mr.TutJnin
        </Typography>
      </Paper>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Paper elevation={3} sx={{ p: 4, flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            My Work
          </Typography>

          {file ? (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 2 }}
            >
              <AttachFileIcon color="primary" />
              <Typography variant="body1">{file.name}</Typography>
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No file chosen
            </Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachFileIcon />}
            sx={{ mb: 2 }}
          >
            Attach
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <TextField
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for the document"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mb: 2 }}
          >
            Submit
          </Button>
          <Typography variant="h6" gutterBottom>
            Submission History
          </Typography>
          {submissions.length > 0 ? (
            <List>
              {submissions.map((submission) => (
                <ListItem
                  key={submission.id}
                  divider
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemText
                    primary={submission.fileName}
                    secondary={`Submitted on ${submission.submissionDate} • Status: ${submission.status}`}
                  />
                  <IconButton
                    edge="end"
                    aria-label="download"
                    onClick={() => handleDownload(submission.url)}
                    sx={{ marginLeft: "auto" }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No submissions yet.
            </Typography>
          )}
        </Paper>

        {/* right side  */}
        <Box sx={{ flexGrow: 1 }}>right side</Box>
      </Box>
    </Box>
  );
}

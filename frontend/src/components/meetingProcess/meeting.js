import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  useMediaQuery
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

export default function MeetingPage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [activeTab, setActiveTab] = useState(0);

  const meetings = [
    {
      id: 1,
      title: "Project Proposal Discussion",
      date: "1/12/2025",
      time: "1:30 PM",
      platform: "Google Meet",
      meetingLink: "http://youtube.com",
      note: "Please prepare the project timeline.",
    },
    {
      id: 2,
      title: "Final Report Review",
      date: "5/12/2025",
      time: "3:00 PM",
      platform: "Zoom",
      meetingLink: "http://youtube.com",
      note: "Bring the final draft of the report.",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderMeetingCard = (meeting) => (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {meeting.title}
      </Typography>

      <Typography variant="body1" color="textSecondary" gutterBottom>
        {meeting.date}, {meeting.time}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 2 }}>
        <Typography variant="subtitle1">{meeting.platform}</Typography>
        <Button
          variant="text"
          startIcon={<LinkIcon />}
          onClick={() => window.open(meeting.meetingLink, "_blank")}
          sx={{ textTransform: "none" }}
        >
          Click to open link
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary">
        <strong>Note:</strong> {meeting.note}
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: "10px" }}
      >
        <Button variant="contained" color="success">
          Approve
        </Button>
        <Button variant="outlined" color="error">
          Decline
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Typography variant="h4" gutterBottom>
        Meetings
      </Typography>

      {/* tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ marginBottom: "20px" }}
      >
        <Tab label="Scheduled" />
        <Tab label="Requested" />
        <Tab label="Completed" />
      </Tabs>

      <Box>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Scheduled Meetings
            </Typography>
            {meetings.map((meeting) => renderMeetingCard(meeting))}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Requested Meetings
            </Typography>
            <Typography variant="body1" color="textSecondary">
              No requested meetings yet.
            </Typography>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Completed Meetings
            </Typography>
            <Typography variant="body1" color="textSecondary">
              No completed meetings yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

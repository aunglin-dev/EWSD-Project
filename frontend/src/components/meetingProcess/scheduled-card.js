import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/AxiosInstance";
import LinkIcon from "@mui/icons-material/Link";
import { useState } from "react";
export default function ScheduledCard({
  meetingId,
  title,
  type,
  datetime,
  platform,
  location,
  meetingLink,
  remark,
  role,
  onDecline,
}) {
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const [loading, setLoading] = useState(false);
  const handleDeclineMeeting = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(
        `http://localhost:8000/api/meetings/${meetingId}`,
        { status: 2 }
      );
      onDecline(meetingId);
      alert("Meeting declined successfully!");
    } catch (error) {
      console.error("Error declining meeting:", error);
      alert("Failed to decline meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minWidth="300px"
      height="376px"
      border="1px solid #939090"
      backgroundColor="#fff"
      borderRadius="10px"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="5px"
        padding={isSmallestScreens ? "10px" : "18px 22px"}
        borderBottom="1px solid #939090"
      >
        <Typography
          variant={isSmallestScreens ? "subtitle2" : "h4"}
          fontWeight="600"
          textTransform="capitalize"
          noWrap
        >
          {title}
        </Typography>
        <Typography
          variant={isSmallestScreens ? "caption" : "subtitle2"}
          paddingX="18px"
          borderRadius="20px"
          backgroundColor="#00c80040"
        >
          {type}
        </Typography>
      </Box>
      <Box
        paddingX={isSmallestScreens ? "10px" : "22px"}
        height="230px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="20px"
      >
        <Box>
          <Typography
            variant={isSmallestScreens ? "h6" : "subtitle2"}
            fontWeight="600"
          >
            Date & Time
          </Typography>
          <Typography
            variant={isSmallestScreens ? "caption" : "h6"}
            fontWeight="400"
          >
            {datetime}
          </Typography>
        </Box>
        <Box>
          {location && (
            <Box>
              <Typography
                variant={isSmallestScreens ? "h6" : "subtitle2"}
                fontWeight="600"
              >
                Location
              </Typography>
              <Typography
                variant={isSmallestScreens ? "caption" : "h6"}
                fontWeight="400"
              >
                {location}
              </Typography>
            </Box>
          )}
          {platform && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant={isSmallestScreens ? "h6" : "subtitle2"}
                  fontWeight="600"
                >
                  Platform
                </Typography>
                <Typography
                  variant={isSmallestScreens ? "caption" : "h6"}
                  fontWeight="400"
                >
                  {platform}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant={isSmallestScreens ? "h6" : "subtitle2"}
                  fontWeight="600"
                >
                  Meeting Link
                </Typography>
                <Link
                  to={meetingLink}
                  style={{
                    display: "block",
                    color: "inherit",
                    fontSize: "14px",
                  }}
                >
                  Click to open link
                </Link>
              </Box>
            </Box>
          )}
        </Box>
        <Box>
          <Typography
            variant={isSmallestScreens ? "h6" : "subtitle2"}
            fontWeight="600"
          >
            Remark
          </Typography>
          <Typography
            variant={isSmallestScreens ? "caption" : "h6"}
            fontWeight={400}
          >
            {remark}
          </Typography>
        </Box>
        {meetingLink && (
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Typography
              variant={isSmallestScreens ? "caption" : "body2"}
              fontWeight={400}
              sx={{ mr: 1 }}
            >
              <strong>Meeting Link:</strong>
            </Typography>
            <IconButton
              component="a"
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <LinkIcon
                sx={{
                  color: "#0000EE",
                  fontSize: "25px",
                }}
              />
            </IconButton>
          </Box>
        )}
        {location && (
          <Typography
            variant={isSmallestScreens ? "caption" : "body2"}
            fontWeight={400}
            sx={{ mt: 1 }}
          >
            <strong>Location:</strong> {location}
          </Typography>
        )}
      </Box>
      <Box
        padding={isSmallestScreens ? "10px" : "5px 22px 18px"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant={isSmallestScreens ? "caption" : "subtitle2"}
          fontWeight="600"
          color="#000"
        >
          Created By: {role}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleDeclineMeeting}
          disabled={loading}
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            fontSize: isSmallestScreens && "16px",
          }}
        >
          {loading ? "Declining..." : "Decline"}
        </Button>
      </Box>
    </Box>
  );
}

import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import axiosInstance from "../../services/AxiosInstance";
import { useState } from "react";
export default function RequestedCard({
  meetingId,
  title,
  type,
  datetime,
  remark,
  declined,
  location,
  meetingLink,
  requesterId,
  currentUserId,
  onCancel,
  onConfirm,
}) {
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const [loading, setLoading] = useState(false);
  const handleCancelRequest = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(
        `http://localhost:8000/api/meetings/${meetingId}`,
        { status: 2 }
      );
      onCancel(meetingId);
      alert("Meeting is canceled successfully!");
    } catch (error) {
      console.error("error canceling meeting", error);
      alert("failed to cancel meeting.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRequest = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(
        `http://localhost:8000/api/meetings/${meetingId}`,
        { status: 1 }
      );
      onConfirm(meetingId);
      alert("meeting request confirmed successfully!");
    } catch (error) {
      console.error("error confirming meeting", error);
      alert("failed to confirm meeting.");
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
        {declined ? (
          <Typography
            variant={isSmallestScreens ? "caption" : "subtitle2"}
            fontWeight="600"
            color="#E10022"
          >
            Canceled
          </Typography>
        ) : (
          <Typography
            variant={isSmallestScreens ? "caption" : "subtitle2"}
            fontWeight="600"
            color="#EB9D0B"
          >
            Pending Request
          </Typography>
        )}
      </Box>
      <Box
        paddingX={isSmallestScreens ? "10px" : "22px"}
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
            Title
          </Typography>
          <Typography
            variant={isSmallestScreens ? "caption" : "h6"}
            fontWeight="400"
          >
            {title}
          </Typography>
        </Box>
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
          <Typography
            variant={isSmallestScreens ? "h6" : "subtitle2"}
            fontWeight="600"
          >
            Remark
          </Typography>
          <Typography
            variant={isSmallestScreens ? "caption" : "h6"}
            fontWeight="400"
          >
            {remark || "No remark provided."}
          </Typography>
        </Box>
      </Box>
      <Box
        padding={isSmallestScreens ? "10px" : "5px 22px 18px"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="10px"
      >
        {requesterId !== currentUserId && !declined && (
          <Button
            variant="contained"
            onClick={handleConfirmRequest}
            disabled={loading}
            sx={{
              backgroundColor: "#00c800",
              "&:hover": { backgroundColor: "#00a800" },
              fontSize: "12px",
            }}
          >
            {loading ? "Confirming..." : "Confirm Request"}
          </Button>
        )}
        {!declined && (
          <Button
            variant="outlined"
            onClick={handleCancelRequest}
            disabled={loading}
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
            }}
          >
            {loading ? "Canceling..." : "Cancel Request"}
          </Button>
        )}
      </Box>
    </Box>
  );
}

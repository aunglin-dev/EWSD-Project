import { useSelector } from "react-redux";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axiosInstance from "../../services/AxiosInstance";
import { useLocation } from "react-router-dom";

export default function OtherMessageParty() {
  const { currentUser } = useSelector((state) => state.auth);
  const location = useLocation();
  const [otherPartyId, setOtherPartyId] = useState(null);
  const [otherParty, setOtherParty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.otherPartyId) {
      setOtherPartyId(location.state.otherPartyId);
    } else {
      console.error("no otherParty id fond.");
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!otherPartyId) return;

    let apiUrl = "";
    if (currentUser.role === "Student") {
      apiUrl = `http://localhost:8000/api/tutors/${otherPartyId}`;
    } else if (currentUser.role === "Tutor") {
      apiUrl = `http://localhost:8000/api/students/${otherPartyId}`;
    }
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setOtherParty(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("error fail fetch other party", error);
        setLoading(false);
      });
  }, [currentUser.role, otherPartyId]);

  return (
    <Box sx={{ width: "250px", padding: "10px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <AccountCircleIcon sx={{ fontSize: "40px", marginRight: "10px" }} />
        <Box>
          <Typography variant="h6">
            {loading ? "Loading..." : otherParty?.name || "Invalid User"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {currentUser.role === "Student" ? "Tutor" : "Student"}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="textSecondary">
        Department: {loading ? "loading...." : otherParty?.department || "N/A"}
      </Typography>
    </Box>
  );
}

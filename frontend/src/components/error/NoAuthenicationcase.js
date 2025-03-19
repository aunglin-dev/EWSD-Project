import React from "react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Loader = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/"); // Redirect to the login page
  };

  return (
    <Box minHeight="95vh">
      <Stack
        direction="column" // Stack items vertically
        justifyContent="center"
        alignItems="center"
        height="80vh"
        spacing={3} // Add spacing between items
      >
        {/* Heading */}
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          You have no permission to view this page. Please login first.
        </Typography>

        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginRedirect}
        >
          Go To Login
        </Button>
      </Stack>
    </Box>
  );
};

export default Loader;

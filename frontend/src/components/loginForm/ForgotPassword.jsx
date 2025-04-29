import React, { useState } from "react";
import {
  IconButton,
  Button,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  useMediaQuery,
  Box,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/forgotPassword",
        {
          email: data.email,
          role: data.role,
        }
      );

      if (res.status === 200) {
        setSuccessMessage(`Password reset link has been sent to your email ${data.email}`);
        setErrorMessage("");
      }
    } catch (err) {
      setErrorMessage(err.response?.data.message || "An error occurred");
      setSuccessMessage("");
      console.error("Forgot password error=>", err.response?.data || err.message);
    }
  };

  return (
    <div
      style={{
        paddingTop: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant={isNonMobileScreens ? "h4" : "h4"}>
          Reset Password
        </Typography>
        <Typography variant="subtitle1" marginBottom="20px" gutterBottom>
          Enter your details to reset password
        </Typography>

        {successMessage && (
          <Box mb={2}>
            <Alert severity="success">{successMessage}</Alert>
          </Box>
        )}
        {errorMessage && (
          <Box mb={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}

        <FormControl fullWidth>
          <FormLabel
            sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
          >
            Role
          </FormLabel>
          <Select
            {...register("role", { required: "Role is required" })}
            defaultValue="student"
            size="small"
            fullWidth
            sx={{ fontSize: "16px", fontWeight: "400" }}
          >
            <MenuItem
              sx={{ fontSize: "16px", fontWeight: "400", color: "#000" }}
              value="staff"
            >
              Staff
            </MenuItem>
            <MenuItem
              sx={{ fontSize: "16px", fontWeight: "400", color: "#000" }}
              value="student"
            >
              Student
            </MenuItem>
            <MenuItem
              sx={{ fontSize: "16px", fontWeight: "400", color: "#000" }}
              value="tutor"
            >
              Tutor
            </MenuItem>
          </Select>
          {errors.role && (
            <Typography variant="caption" color="error">
              {errors.role.message}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>
            Email
          </FormLabel>
          <OutlinedInput
            type="text"
            size="small"
            placeholder="abc@yahoo.com"
            autoComplete="off"
            fullWidth
            sx={{ fontSize: "16px", fontWeight: "400" }}
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                message: "Invalid Email Format",
              },
              required: "* Email is required",
            })}
          />
          {errors.email && (
            <Typography variant="caption" color="error">
              {errors.email.message}
            </Typography>
          )}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ py: 1.5, fontWeight: "bold", mt: 4 }}
        >
          Reset Password
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10px 0",
          }}
        >
          <Button 
            type="button" 
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </div>
      </form>
    </div>
  );
}
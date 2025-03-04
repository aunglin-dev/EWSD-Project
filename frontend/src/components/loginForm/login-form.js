import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  Button,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../Storage/authSlice";
import axios from "axios";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const res = await axios.post("http://localhost:8000/api/auth/signin", {
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (res.status === 200) {
        const user = res.data;
        const { role } = user;
        window.alert("Welcome to the E-Tutoring System!");

        console.log("user data=>", user);
        dispatch(loginSuccess(user));

        if (role === "staff") {
          navigate("/StaffHome");
        } else if (role === "Student") {
          navigate(`/student-dashboard/${user._id}`);
        } else if (role === "Tutor") {
          navigate("/TutorHome");
        }
      }
    } catch (err) {
      console.error("Login error=>", err.response?.data || err.message);
      dispatch(
        loginFailure(err.response?.data?.message || "Invalid credentials")
      );
    }
  };

  return (
    <div
      style={{
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
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Role</FormLabel>
          <Select
            {...register("role", { required: "Role is required" })}
            defaultValue="student"
            size="small"
            fullWidth
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="tutor">Tutor</MenuItem>
          </Select>
          {errors.role && (
            <Typography variant="caption" color="error">
              {errors.role.message}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Email</FormLabel>
          <OutlinedInput
            type="email"
            size="small"
            placeholder="abc@yahoo.com"
            autoComplete="off"
            fullWidth
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <Typography variant="caption" color="error">
              {errors.email.message}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Password</FormLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            size="small"
            fullWidth
            autoComplete="off"
            {...register("password", { required: "Password is required" })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && (
            <Typography variant="caption" color="error">
              {errors.password.message}
            </Typography>
          )}
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ py: 1.5, fontWeight: "bold" }}
        >
          Login
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <Button type="button" sx={{ textTransform: "none" }}>
            Forgot password?
          </Button>
          <Button type="button" sx={{ textTransform: "none" }}>
            Need Help?
          </Button>
        </div>
      </form>
    </div>
  );
}

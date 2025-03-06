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
  useMediaQuery,
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
import FormErrorMessage from "../error/formErrorMessage";

export default function LoginForm() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
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
        // window.alert("Welcome to the E-Tutoring System!");

        console.log("user data=>", user);
        dispatch(loginSuccess(user));

        if (role === "staff") {
          navigate("/staff-dashboard");
        } else if (role === "Student") {
          navigate(`/student-dashboard/${user._id}`);
        } else if (role === "Tutor") {
          navigate("/tutor-dashboard");
        }
      }
    } catch (err) {
      window.alert(err.response?.data.message);
      console.error("Login error=>", err.response?.data || err.message);
      dispatch(
        loginFailure(err.response?.data?.message || "Invalid credentials")
      );
    }
  };

  return (
    <div
      style={{
        paddingTop: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 80px)",
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
          E-Tutoring Platform
        </Typography>
        <Typography variant="subtitle1" marginBottom="20px" gutterBottom>
          Login to access your portal
        </Typography>

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
          {/* <FormErrorMessage error={errors.role?.message || "Invalid role"} /> */}
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>Email</FormLabel>
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
          <FormErrorMessage error={errors.email?.message || ""} />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel
            sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
          >
            Password
          </FormLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            size="small"
            fullWidth
            autoComplete="off"
            sx={{ fontSize: "16px", fontWeight: "400" }}
            {...register("password", {
              pattern: {
                value: /.{8,}/,
                message: "Password must be more than 8 characters.",
              },
              required: "* Password is required",
            })}
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
          <FormErrorMessage error={errors.password?.message || ""} />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ py: 1.5, fontWeight: "bold", mt: 4 }}
        >
          Login
        </Button>
        {/* <div
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
        </div> */}
      </form>
    </div>
  );
}

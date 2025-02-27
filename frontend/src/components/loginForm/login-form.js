import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  Button,
  Typography,
  OutlinedInput,
  Select,
  Menu,
  MenuItem,
  FormControl,
  FormLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormErrorMessage from "../error/formErrorMessage";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "../../Storage/StaffSlice";
import axios from "axios";

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Call react-redux Dispatch
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      console.log("loggin data=>", data.email);
      console.log("loggin data=>", data);

      //Call Backend API
      const res = await axios.post("http://localhost:8000/api/auth/signin", {
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (res.status == 200) {
        // window.alert("Welcome From E-Tutoring System ");
        dispatch(loginSuccess(res.data));
        navigate("/StaffHome");
        console.log(res.data);
      }
    } catch (err) {
      data.role === "staff" ?
        window.alert("Staff's email or password is wrong.") :
        data.role === "student" ?
          window.alert("Student's email or password is wrong.") :
          window.alert("Tutor's email or password is wrong.");
      dispatch(loginFailure);
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
          marginTop: "50px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h5" align="left" gutterBottom>
          Login to access your portal
        </Typography>

        <FormControl fullWidth>
          <FormLabel>Role</FormLabel>
          <Select
            {...register("role", { required: "Role is required" })}
            defaultValue="student"
            size="small"
            fullWidth
          >
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="tutor">Tutor</MenuItem>
          </Select>
          {/* <FormErrorMessage error={errors.role?.message || "Invalid role"} /> */}
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel color="black">Email</FormLabel>
          <OutlinedInput
            // type="email"
            size="small"
            placeholder="abc@yahoo.com"
            autoComplete="off"
            fullWidth
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                message: "Invalid Email Format",
              },
              required: "* Email is required"
            })}
          />
          <FormErrorMessage error={errors.email?.message || ""} />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel color="black">Password</FormLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            size="small"
            fullWidth
            autoComplete="off"
            {...register("password", {
              pattern: {
                value: /.{8,}/,
                message: "Invalid Password Format",
              },
              required: "* Password is required"
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
          <FormErrorMessage
            error={errors.password?.message || ""}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: "bold",
          }}
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

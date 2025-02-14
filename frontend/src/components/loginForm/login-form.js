import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  Button,
  Typography,
  OutlinedInput,
  FormControl,
  FormLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import FormErrorMessage from "../error/formErrorMessage";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    login,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("loggin data=>", data);
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
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <FormControl fullWidth>
          <FormLabel color="black">Email</FormLabel>
          <OutlinedInput
            type="email"
            size="small"
            placeholder="abc@yahoo.com"
            autoComplete="off"
            fullWidth
          />
          <FormErrorMessage error={errors.email?.message || "invalid email"} />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel color="black">Password</FormLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            size="small"
            fullWidth
            autoComplete="off"
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
            error={errors.password?.message || "Invalid password"}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            fontWeight: "bold",
          }}
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

import React from "react";
import { Box, TextField, Button, Typography, Container, Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Login = () => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:3000/user/login", values);
        // Generate a dummy token
        const dummyToken = "dummyToken12345ABCDEF";
        // Save the dummy token in localStorage
        sessionStorage.setItem("authToken", dummyToken);
        console.log(response.data);
        setSnackbarMessage("Login Successful");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirect to dashboard or any other page
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f7fc",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          padding: "40px 30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            marginBottom: "20px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          LOGIN TO YOUR ACCOUNT
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            label="Email Address"
            name="email"
            variant="outlined"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            sx={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#3f51b5",
              color: "#fff",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#2c387e",
              },
            }}
          >
            Login
          </Button>
          <Typography
            align="center"
            sx={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "#3f51b5",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Sign Up
            </a>
          </Typography>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Login;

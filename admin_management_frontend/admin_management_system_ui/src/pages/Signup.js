import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const roles = [
    { roleId: 1, name: "ADMIN" },
    { roleId: 2, name: "STAFF" },
    { roleId: 3, name: "SYSTEM_ADMIN" },
  ];

  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Validation schema
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .matches(/^[A-Za-z]{3,}$/, "First name must have at least 3 letters and only alphabets")
      .required("First name is required"),
    last_name: Yup.string()
      .matches(/^[A-Za-z]+$/, "Last name should contain only letters")
      .required("Last name is required"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"], "Please select a valid gender")
      .required("Gender is required"),
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
    contact_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Contact number must be exactly 10 digits starting with 6, 7, 8, or 9")
      .required("Contact number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string()
      .oneOf(["ADMIN", "STAFF", "SYSTEM_ADMIN"], "Please select a valid role")
      .required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      contact_number: "",
      password: "",
      confirm_password: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const selectedRole = roles.find((role) => role.name === values.role);

      const formattedData = {
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender.toUpperCase(),
        email: values.email,
        contact_number: values.contact_number,
        password: values.password,
        role: selectedRole,
      };

      try {
        const response = await axios.post("http://localhost:3000/user/", formattedData);
        if (response.status === 201 || response.status === 200) {
          setSnackbarMessage("Successfully signed up!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "An error occurred. Please try again."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: "50px",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{
          color: "#3f51b5", 
          fontWeight: "bold", 
          fontFamily: "'Roboto', sans-serif"
        }}
      >
        SIGN UP
      </Typography>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="First Name"
            name="first_name"
            variant="outlined"
            fullWidth
            value={formik.values.first_name}
            onChange={formik.handleChange}
            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
          <TextField
            label="Last Name"
            name="last_name"
            variant="outlined"
            fullWidth
            value={formik.values.last_name}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
            {formik.touched.gender && formik.errors.gender && (
              <Typography color="error" variant="caption">
                {formik.errors.gender}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Contact Number"
            name="contact_number"
            variant="outlined"
            fullWidth
            value={formik.values.contact_number}
            onChange={formik.handleChange}
            error={formik.touched.contact_number && Boolean(formik.errors.contact_number)}
            helperText={formik.touched.contact_number && formik.errors.contact_number}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            label="Confirm Password"
            name="confirm_password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.role && formik.errors.role && (
              <Typography color="error" variant="caption">
                {formik.errors.role}
              </Typography>
            )}
          </FormControl>
          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
              borderRadius: "8px",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </form>

      <Typography
  variant="body2"
  sx={{
    textAlign: "center",
    marginTop: 2,
    color: "#555", // Light text color
    fontSize: "0.875rem", // Slightly smaller font size for a subtle look
  }}
>
  Already have an account?{" "}
  <Button
    onClick={() => navigate("/login")}
    sx={{
      padding: 0,
      textTransform: "none", // Prevent uppercase transformation
      "&:hover": {
        backgroundColor: "transparent", // Remove background on hover
        textDecoration: "underline", // Underline on hover for interaction feedback
      },
    }}
  >
    <Typography
      color="primary"
      variant="body2"
      sx={{
        textDecoration: "none", // Initial state without underline
        fontWeight: "600", // Bold text for better emphasis
        transition: "all 0.3s ease", // Smooth transition on hover
        "&:hover": {
          color: "#1976d2", // Change color on hover (can adjust to fit your theme)
        },
      }}
    >
      Login
    </Typography>
  </Button>
</Typography>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;

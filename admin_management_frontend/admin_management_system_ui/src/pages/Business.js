import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
  TextField,
  Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Navbar from "./Navbar";
import { Edit } from "iconsax-react";
import { useNavigate } from "react-router-dom";

const Business = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]); // For search results
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const navigate = useNavigate();
  const fetchBusinesses = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/business")
      .then((response) => {
        const formattedData = response.data.data.map((business) => ({
          ...business,
          id: business.business_id,
        }));
        setBusinesses(formattedData);
        setFilteredBusinesses(formattedData); // Initialize filtered list
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch businesses.",
          severity: "error",
        });
        setLoading(false);
      });
  };
  const authToken = sessionStorage.getItem("authToken"); // Check if the user is logged in
  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    // setLoading(true);
fetchBusinesses();

  ;
  }, [authToken]);
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const formik = useFormik({
    initialValues: {
      business_name: "",
      business_email: "",
      contact_number: "",
      city: "",
    },
    validationSchema: Yup.object().shape({
      business_name: Yup.string().required("Business Name is required"),
      business_email: Yup.string()
        .email("Invalid email address")
        .required("Business Email is required"),
      contact_number: Yup.string()
        .matches(/^\d{10}$/, "Contact Number must be 10 digits")
        .required("Contact Number is required"),
      city: Yup.string().required("City is required"),
    }),
    onSubmit: (values) => {
      if (editMode) {
        axios
          .put(`http://localhost:3000/business/${selectedBusiness.id}`, values)
          .then(() => {
            fetchBusinesses();
            setOpenDialog(false);
            setSnackbar({
              open: true,
              message: "Business updated successfully!",
              severity: "success",
            });
          })
          .catch((error) => {
            console.error("Error updating business:", error);
            setSnackbar({
              open: true,
              message: "Failed to update business.",
              severity: "error",
            });
          });
      } else {
        axios
          .post("http://localhost:3000/business", values)
          .then(() => {
            fetchBusinesses();
            setOpenDialog(false);
            setSnackbar({
              open: true,
              message: "Business created successfully!",
              severity: "success",
            });
          })
          .catch((error) => {
            console.error("Error creating business:", error);
            setSnackbar({
              open: true,
              message: "Failed to create business.",
              severity: "error",
            });
          });
      }
    },
  });

  const handleEdit = (row) => {
    setEditMode(true);
    setSelectedBusiness(row);
    setOpenDialog(true);
    formik.setValues({
      business_name: row.business_name,
      business_email: row.business_email,
      contact_number: row.contact_number,
      city: row.city,
    });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedBusiness(null);
    formik.resetForm();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = businesses.filter((business) =>
      ["business_name", "business_email", "contact_number", "city"].some((field) =>
        business[field].toLowerCase().includes(query)
      )
    );
    setFilteredBusinesses(filtered);
  };

  const columns = [
    { field: "id", headerName: "Business ID", width: 150 },
    { field: "business_name", headerName: "Business Name", width: 200 },
    { field: "business_email", headerName: "Business Email", width: 200 },
    { field: "contact_number", headerName: "Contact Number", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "created_time", headerName: "Created Time", width: 200 },
    { field: "last_modified_time", headerName: "Last Modified Time", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "5px",
          }}
        >
          <Edit size="25" color="#003366" onClick={() => handleEdit(params.row)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar authToken={authToken}/>
      {authToken ? (
      <Box sx={{ padding: 3}}>
        <Typography variant="h4" gutterBottom>
          Manage Businesses
        </Typography>
        <TextField
          fullWidth
          placeholder="Search by Business Name, Email, Contact Number, or City"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Create New Business
        </Button>
        <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredBusinesses}
          columns={columns}
          pageSize={10}  // Set the page size to 10
          rowsPerPageOptions={[10]}  // Set the pagination options to 10
          loading={loading}
          pagination
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
      />

        </Box>

        {/* Dialog for Create/Edit */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {editMode ? "Edit Business" : "Create New Business"}
          </DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField
                name="business_name"
                fullWidth
                label="Business Name"
                margin="normal"
                value={formik.values.business_name}
                onChange={formik.handleChange}
                error={formik.touched.business_name && Boolean(formik.errors.business_name)}
                helperText={formik.touched.business_name && formik.errors.business_name}
              />
              <TextField
                name="business_email"
                fullWidth
                label="Business Email"
                margin="normal"
                value={formik.values.business_email}
                onChange={formik.handleChange}
                error={formik.touched.business_email && Boolean(formik.errors.business_email)}
                helperText={formik.touched.business_email && formik.errors.business_email}
              />
              <TextField
                name="contact_number"
                fullWidth
                label="Contact Number"
                margin="normal"
                value={formik.values.contact_number}
                onChange={formik.handleChange}
                error={formik.touched.contact_number && Boolean(formik.errors.contact_number)}
                helperText={formik.touched.contact_number && formik.errors.contact_number}
              />
              <TextField
                name="city"
                fullWidth
                label="City"
                margin="normal"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editMode ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          severity={snackbar.severity}
        />
      </Box>
      ) : ( <Container
        maxWidth="lg"
        sx={{
          marginTop: "50px",
          padding: "20px",
          borderRadius: "10px",
          background: "linear-gradient(145deg, #003366, #006699)",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.4)",
        }}
      ><Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#FF416C",
            background: "linear-gradient(90deg, #FF416C, #FF4B2B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "1px 1px 10px rgba(255, 65, 108, 0.7)",
            marginBottom: "20px",
          }}
        >
          Please Log In to Continue
        </Typography>
        <Button
          variant="contained"
          onClick={handleLoginRedirect}
          sx={{
            background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: "30px",
            padding: "10px 30px",
            boxShadow: "0 5px 15px rgba(78, 84, 200, 0.5)",
            textTransform: "uppercase",
            "&:hover": {
              background: "linear-gradient(90deg, #8f94fb, #4e54c8)",
              boxShadow: "0 7px 20px rgba(78, 84, 200, 0.8)",
            },
          }}
        >
          Go to Login
        </Button>
      </Box>
      </Container>)}
    </>
  );
};

export default Business;

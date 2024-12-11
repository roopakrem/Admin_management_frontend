import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const SalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const authToken = sessionStorage.getItem("authToken"); // Check if the user is logged in

  // Fetch sales data from API
  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      return;
    }fetchSales();
  }, [authToken]);

  const fetchSales = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/sales")
      .then((response) => {
        const formattedData = response.data.data.map((sale) => ({
          ...sale,
          id: sale.sales_id, // Add 'id' field for DataGrid
        }));
        setSales(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch sales.",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      invoice_number: "",
      business_id: "",
      amount: "",
    },
    validationSchema: Yup.object({
      invoice_number: Yup.string().required("Invoice Number is required"),
      business_id: Yup.number()
        .typeError("Business ID must be a number")
        .required("Business ID is required"),
      amount: Yup.number()
        .typeError("Amount must be a valid number")
        .required("Amount is required"),
    }),
    onSubmit: (values) => {
      // Create new sale
      axios
        .post("http://localhost:3000/sales", values)
        .then(() => {
          fetchSales();
          setSnackbar({
            open: true,
            message: "Sale created successfully!",
            severity: "success",
          });
          setOpenDialog(false);
        })
        .catch((error) => {
          console.error("Error creating sale:", error);
          setSnackbar({
            open: true,
            message: "Failed to create sale.",
            severity: "error",
          });
        });
    },
  });

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleCreateNew = () => {
    setOpenDialog(true);
    formik.resetForm();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "sales_id", headerName: "Sales ID", width: 150 },
    { field: "invoice_number", headerName: "Invoice Number", width: 200 },
    { field: "business_id", headerName: "Business ID", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "created_time", headerName: "Created Time", width: 200 },
    { field: "last_modified_time", headerName: "Last Modified Time", width: 200 },
  ];

  return (
    <>
      <Navbar authToken={authToken} /> {/* Pass authToken to Navbar */}
      {authToken ? (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Sales
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: 2 }}
          onClick={handleCreateNew}
        >
          Create New Sale
        </Button>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={sales}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            loading={loading}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>

        {/* Dialog for Creating a Sale */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create New Sale</DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField
                name="invoice_number"
                fullWidth
                label="Invoice Number"
                margin="normal"
                value={formik.values.invoice_number}
                onChange={formik.handleChange}
                error={
                  formik.touched.invoice_number &&
                  Boolean(formik.errors.invoice_number)
                }
                helperText={
                  formik.touched.invoice_number &&
                  formik.errors.invoice_number
                }
              />
              <TextField
                name="business_id"
                fullWidth
                label="Business ID"
                margin="normal"
                value={formik.values.business_id}
                onChange={formik.handleChange}
                error={
                  formik.touched.business_id &&
                  Boolean(formik.errors.business_id)
                }
                helperText={
                  formik.touched.business_id && formik.errors.business_id
                }
              />
              <TextField
                name="amount"
                fullWidth
                label="Amount"
                margin="normal"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={
                  formik.touched.amount && Boolean(formik.errors.amount)
                }
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Create
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
          ContentProps={{
            sx: {
              backgroundColor:
                snackbar.severity === "success" ? "green" : "red",
            },
          }}
        />
      </Box>
      ) : (<Container
        maxWidth="lg"
        sx={{
          marginTop: "50px",
          padding: "20px",
          borderRadius: "10px",
          background: "linear-gradient(145deg, #003366, #006699)",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Box
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

export default SalesManagement;

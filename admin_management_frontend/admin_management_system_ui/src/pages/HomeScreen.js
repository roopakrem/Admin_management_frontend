import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const HomeScreen = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken"); // Check if the user is logged in

  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/business",)
      .then((response) => {
        setBusinesses(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch businesses. Please try again later.");
        setLoading(false);
      });
  }, [authToken]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar authToken={authToken} /> {/* Pass authToken to Navbar */}
      <Container
        maxWidth="lg"
        sx={{
          marginTop: "50px",
          padding: "20px",
          borderRadius: "10px",
          background: "linear-gradient(145deg, #003366, #006699)",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        {!authToken ? (
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
        ) : (
          <>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              Welcome to Your Dashboard
            </Typography>
            <Typography
              align="center"
              sx={{
                marginBottom: "30px",
                color: "#b0bec5",
                fontSize: "1.2rem",
                textShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
              }}
            >
              Explore and manage your businesses with style and ease.
            </Typography>

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <CircularProgress
                  sx={{
                    color: "#4e54c8",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </Box>
            ) : error ? (
              <Typography
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#FF416C",
                  textShadow: "1px 1px 5px rgba(255, 65, 108, 0.7)",
                }}
              >
                {error}
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {businesses.map((business) => (
                  <Grid item xs={12} sm={6} md={4} key={business.id}>
                    <Card
                      sx={{
                        borderRadius: "20px",
                        background: "linear-gradient(145deg, #1a4567, #3e7a8a)",
                        boxShadow: "0 10px 20px rgba(44, 62, 80, 0.5)",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: "0 15px 30px rgba(44, 62, 80, 0.8)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            color: "#ffffff",
                            fontWeight: "bold",
                            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          {business.business_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#e0e0e0",
                          }}
                        >
                          City: {business.city}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;

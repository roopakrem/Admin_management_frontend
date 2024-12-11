import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  // Check if authToken is available on initial render or after login/logout
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    setAuthToken(null);  // Clear the token in the state
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(145deg, #003366, #006699)",
        padding: "10px 20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.4)",
            cursor: "pointer",
            color: "white",
          }}
        >
          Business Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: "20px" }}>
          {authToken && (
            <>
              <Button
                color="inherit"
                href="/"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <HomeIcon sx={{ marginRight: "8px", color: "white" }} />
                Home
              </Button>
              <Button
                color="inherit"
                href="/business"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <BusinessIcon sx={{ marginRight: "8px", color: "white" }} />
                Businesses
              </Button>
              <Button
                color="inherit"
                href="/sales"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <AttachMoneyIcon sx={{ marginRight: "8px", color: "white" }} />
                Sales
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <ExitToAppIcon sx={{ marginRight: "8px", color: "white" }} />
                Logout
              </Button>
            </>
          )}
          {!authToken && (
            <Button
              color="inherit"
              href="/login"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <ExitToAppIcon sx={{ marginRight: "8px", color: "white" }} />
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

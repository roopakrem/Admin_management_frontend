import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import HomeScreen from "./pages/HomeScreen";
import Business from "./pages/Business";
import Sales from "./pages/Sales";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/business" element={<Business />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
  );
};

export default App;

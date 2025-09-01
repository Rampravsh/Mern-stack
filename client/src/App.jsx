import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

import ResetPassword from "./pages/ResetPassword";
import OtpVerify from "./pages/OtpVerify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
      </Routes>
    </>
  );
};

export default App;
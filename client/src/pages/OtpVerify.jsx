import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl } = useContext(AppContext);
  const [otp, setOtp] = useState("");
  const email = location.state?.email;

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !email) {
      toast.error("OTP and email are required.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        otp,
        email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/resend-otp`, { email });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-indigo-600 p-8 text-white text-center">
        <img src={assets.header_img} alt="Header" className="w-64 h-64 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Verify Your Account</h1>
        <p className="text-lg">
          An OTP has been sent to your email address. Please enter it below to verify your account.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <img src={assets.logo} alt="Logo" className="w-24 h-24 mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Enter OTP
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please check your email for the OTP.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={handleOtpChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your OTP"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify OTP
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <button
              onClick={handleResendOtp}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;

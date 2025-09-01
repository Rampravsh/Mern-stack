import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

// API endpoints can be managed in a central place.
const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
};

/**
 * A reusable input component for the authentication form.
 * In a larger app, this would be in its own file (e.g., /components/FormInput.jsx).
 */
const FormInput = ({
  id,
  name,
  type,
  autoComplete,
  value,
  onChange,
  placeholder,
  icon,
  label,
}) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <img
          src={icon}
          alt={`${name} icon`}
          className="w-5 h-5 text-gray-400"
        />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        onChange={onChange}
        value={value}
        className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const Login = () => {
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // State to toggle between Login and Sign Up views
  const [isLogin, setIsLogin] = useState(true);

  // State for form fields, using more descriptive name `formData`
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Handles changes in form inputs and updates the state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Toggles the auth mode between Login and Sign Up and resets the form.
   * @param {boolean} newIsLogin - The new mode to set.
   */
  const toggleAuthMode = (newIsLogin) => {
    setIsLogin(newIsLogin);
    // Reset form data when switching modes for a better UX
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  /**
   * Handles the form submission for both login and registration.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   */
  const handleAuthentication = async (e) => {
    e.preventDefault();

    // Client-side validation for password confirmation on registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return; // Stop the submission
    }

    const url = `${backendUrl}${
      isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER
    }`;

    // Prepare payload based on auth mode
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          username: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await axios.post(url, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);

        if (isLogin) {
          navigate("/");
        } else {
          // After successful registration, navigate to the OTP verification page
          navigate("/otp-verify", { state: { email: formData.email } });
        }
      } else {
        toast.error(response.data.message || "An unknown error occurred.");
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.verification === false) {
        toast.error(errorData.message);
        navigate("/otp-verify", { state: { email: formData.email } });
      } else {
        const errorMessage =
          errorData?.message ||
          "An unexpected error occurred. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left Side: Information Panel */}
      <div
        className={`hidden md:flex md:w-1/2 flex-col justify-center items-center bg-indigo-600 p-8 text-white text-center ${
          isLogin ? "md:order-2" : "md:order-1"
        }`}
      >
        <img src={assets.header_img} alt="Header" className="w-64 h-64 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Welcome to Our Community</h1>
        <p className="text-lg">
          Join us to manage your account and explore a world of possibilities.
        </p>
      </div>

      {/* Right Side: Form Panel */}
      <div
        className={`w-full md:w-1/2 flex justify-center items-center p-8 ${
          isLogin ? "md:order-1" : "md:order-2"
        }`}
      >
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <img src={assets.logo} alt="Logo" className="w-24 h-24 mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isLogin ? "Welcome Back!" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin
                ? "Sign in to continue to your account"
                : "Get started with your free account"}
            </p>
          </div>

          {/* Auth Mode Toggle Buttons */}
          <div className="flex justify-center rounded-md shadow-sm">
            <button
              onClick={() => toggleAuthMode(true)}
              className={`w-full py-2 px-4 text-sm font-medium ${
                isLogin ? "text-white bg-indigo-600" : "text-gray-700 bg-white"
              } border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Login
            </button>
            <button
              onClick={() => toggleAuthMode(false)}
              className={`w-full py-2 px-4 text-sm font-medium ${
                !isLogin ? "text-white bg-indigo-600" : "text-gray-700 bg-white"
              } border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Sign Up
            </button>
          </div>

          {/* Unified Authentication Form */}
          <form className="space-y-6" onSubmit={handleAuthentication}>
            {!isLogin && (
              <FormInput
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={onChangeHandler}
                placeholder="Your Name"
                icon={assets.person_icon}
                label="Full Name"
              />
            )}
            <FormInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={onChangeHandler}
              placeholder="you@example.com"
              icon={assets.mail_icon}
              label="Email address"
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={formData.password}
              onChange={onChangeHandler}
              placeholder="********"
              icon={assets.lock_icon}
              label="Password"
            />
            {!isLogin && (
              <FormInput
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={onChangeHandler}
                placeholder="********"
                icon={assets.lock_icon}
                label="Confirm Password"
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="/reset-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => toggleAuthMode(!isLogin)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

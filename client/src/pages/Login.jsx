import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    "confirm-password": "",
  });

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onAuthentication = async (e) => {
    e.preventDefault();

    let url = backendUrl;
    if (isLogin) {
      url += "/api/auth/login";
    } else {
      url += "/api/auth/register";
    }

    try {
      const response = await axios.post(url, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        if (isLogin) {
          navigate("/");
        } else {
          setIsLogin(true);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left Side: Information */}
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

      {/* Right Side: Form */}
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

          <div className="flex justify-center rounded-md shadow-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-full py-2 px-4 text-sm font-medium ${
                isLogin ? "text-white bg-indigo-600" : "text-gray-700 bg-white"
              } border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-full py-2 px-4 text-sm font-medium ${
                !isLogin ? "text-white bg-indigo-600" : "text-gray-700 bg-white"
              } border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <form className="space-y-6" onSubmit={onAuthentication}>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.mail_icon}
                      alt="mail icon"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={onChangeHandler}
                    value={data.email}
                    className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.lock_icon}
                      alt="lock icon"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={onChangeHandler}
                    value={data.password}
                    className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="********"
                  />
                </div>
              </div>

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

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={onAuthentication}>
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.person_icon}
                      alt="person icon"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    onChange={onChangeHandler}
                    value={data.name}
                    className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.mail_icon}
                      alt="mail icon"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={onChangeHandler}
                    value={data.email}
                    className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.lock_icon}
                      alt="lock icon"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    onChange={onChangeHandler}
                    value={data.password}
                    className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="********"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.lock_icon}
                      alt="lock icon"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    onChange={onChangeHandler}
                    value={data["confirm-password"]}
                    className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="********"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          )}

          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
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

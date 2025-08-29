import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32 " />
      <h1 className="text-xl font-bold">Navbar</h1>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 pointer:cursor transition-all"
      >
        Login
        <img
          src={assets.arrow_icon}
          alt="Login Icon"
          className="inline-block ml-2"
        />
      </button>
    </div>
  );
};

export default Navbar;

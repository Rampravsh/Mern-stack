import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4 px-4">
      <img
        src={assets.header_img}
        alt="Logo"
        className="w-28 sm:w-32 rounded-full"
      />
      <h1 className="text-3xl font-bold">
        hey developer{" "}
        <img
          src={assets.hand_wave}
          alt=""
          className="inline-block ml-2 w-8 aspect-square"
        />
      </h1>
      <h2 className="text-xl">Welcome to our website!</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time.
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;

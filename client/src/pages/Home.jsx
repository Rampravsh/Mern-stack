import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="min-h-screen font-outfit-custom flex flex-col justify-center items-center bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;

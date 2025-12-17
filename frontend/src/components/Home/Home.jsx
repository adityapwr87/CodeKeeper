import React from "react";
// Import the separated components
import Navbar from "./Navbar";
import MainSection from "./MainSection";
import Footer from "../Dashboard/Footer/Footer";

// No specific CSS needed here if the components handle their own styles
// But you can add a global container class if you want extra spacing

const Home = () => {
  return (
    <div style={{ backgroundColor: "#05010d", minHeight: "100vh" }}>
      <Navbar />
      <MainSection />
      <Footer />
    </div>
  );
};

export default Home;

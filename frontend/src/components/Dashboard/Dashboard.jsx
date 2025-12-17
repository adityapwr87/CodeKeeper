import React from "react";
// Import the separated components
import Navbar from "./Navbar/Navbar";
import MainSection from "./MainSection/MainSection";
import Footer from "./Footer/Footer";

// No specific CSS needed here if the components handle their own styles
// But you can add a global container class if you want extra spacing

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: "#05010d", minHeight: "100vh" }}>
      <Navbar />
      <MainSection />
      <Footer />
    </div>
  );
};

export default Dashboard;

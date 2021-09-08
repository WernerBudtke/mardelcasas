import "../styles/Home.css";
import React from "react";
import Footer from "../components/Footer";
import HeroHome from "../components/HeroHome";
import Main from "../components/Main";
const Home = () => {
  return (
    <div className="containerHome">
      <HeroHome />
      <Main />
      <Footer />
    </div>
  );
};

export default Home;

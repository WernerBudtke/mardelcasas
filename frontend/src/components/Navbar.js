import "../styles/NavBar.css";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);

  const nav = [
    { name: "Ingresar Sesion", ruta: "/iniciar-sesion" },
    { name: "Registrarse", ruta: "/registrarse" },
    { name: "Admin", ruta:"/admin"}
  ];
  var navMap = nav.map((a, index) => (
    <Link key={index} to={a.ruta}>
      {a.name}
    </Link>
  ));

  return (
    <div className="navBar">
      <button onClick={() => setNavOpen(!navOpen)}>
        <img
          className="logoUser"
          src="/assets/logo.png"
          alt="logo-user"
          width="50px"
          height="50px"
        />
      </button>
      {navOpen && (
        <>
          <nav className="userMenu">{navMap}</nav>
          <div className="closeDiv1" 
            onClick={() => setNavOpen(false)}>
          </div>
          <div className="closeDiv2" 
            onClick={() => setNavOpen(false)}>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;

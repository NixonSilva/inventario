import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAuth } from "../AutoContext"; // Asegúrate que esta ruta sea correcta
import "../styles/Header.css";
import logo from "../assets/Logo_navemar.jpg";

const Header = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { logout } = useAuth(); // 👈 Aquí usamos tu logout del contexto

  const toggleMenu = () => {
  setMenuAbierto((prev) => {
    console.log("menuAbierto:", !prev);
    return !prev;
  });
 };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo Navemar" />
      </div>

      <nav>
        <ul>
          <li><a href="#">Informes</a></li>
          <li><a href="#">Contacto</a></li>
          <li><a href="#">Proveedores</a></li>
        </ul>

        <div className="user-menu-container">
          <button onClick={toggleMenu} className="icon-button">
            {menuAbierto ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {menuAbierto && (
            <div className="dropdown-menus">
              <button className="logouts-button" onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

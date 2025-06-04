// src/components/Header.js
import React from "react"; // 👈 Importación necesaria
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <img src="./Logo_navemar.jpg" alt="Logo de la empresa" />
      </div>
      <nav>
        <ul>
          <li><Link to="/informes">Informes</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/proveedores">Proveedores</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

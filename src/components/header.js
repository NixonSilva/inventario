import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FiUser } from "react-icons/fi";
import { useAuth } from "../AutoContext"; // Asegúrate de que la ruta sea correcta
import "../styles/Header.css";
import logo from "../assets/Logo_navemar.jpg";

const Header = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate(); // ✅ Aquí obtenemos navigate correctamente

  const toggleMenu = () => {
    setMenuAbierto((prev) => {
      console.log("menuAbierto:", !prev);
      return !prev;
    });
  };

  const handleVerPerfil = () => {
    console.log("Navegando al perfil...");
    navigate("/miPerfil"); // ✅ Funciona ahora correctamente
    setMenuAbierto(false);
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo Navemar" />
      </div>

      <nav>
        <ul>
          <li><a href="/informes">Informes</a></li>
          <li><a href="#">Contacto</a></li>
          <li><a href="#">Proveedores</a></li>
        </ul>

        <div className="user-menu-container">
          <button onClick={toggleMenu} className="icon-button">
            <FiUser size={20} />
          </button>

          {menuAbierto && (
            <div className="dropdown-menus">
              <button className="profile-button" onClick={handleVerPerfil}>
                Ver mi perfil
              </button>
              <button className="logouts-button" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

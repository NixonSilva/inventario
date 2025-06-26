import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BuscarUsuario.css"

function BuscarUsuario() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const buscarUsuario = async () => {
    try {
      const response = await axios.get(`http://172.20.158.193/inventario_navesoft/backend/buscar-usuario.php=${nombre}`);
      if (response.data.success) {
        // Redirigir si el usuario fue encontrado
        navigate("/Requipos", {
          state: {
            usuarioNombre: response.data.usuario.NOMBRE,
            cedula: response.data.usuario.CEDULA,
          },
        });
      } else {
        setError("Usuario no encontrado");
      }
    } catch (error) {
      setError("Error al buscar el usuario");
      console.error(error);
    }
  };

  return (
    <div className="page-center">
        <div className="buscar-usuario-container">
        <h2>Buscar usuario por nombre</h2>

        <input
            type="text"
            placeholder="Ingrese nombre del usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
        />

        <div>
            <button onClick={() => navigate("/equipos")}>Ver registros</button>
            <button onClick={buscarUsuario}>Buscar</button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    </div>
 );
}

export default BuscarUsuario;


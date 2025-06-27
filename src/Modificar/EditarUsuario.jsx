// EditarUsuario.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarUsuario.css"; // Nuevo nombre

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/actualizarUsuario.php";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: "",
    ubicacion: "",
    empresas: "",
    unidades_negocio: ""
  });

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL, {
      action: "actualizar",
      id: id,
      ...usuario
    })
    .then(() => {
      alert("Usuario actualizado correctamente");
      navigate("/usuarios");
    })
    .catch((err) => console.error("Error al actualizar usuario", err));
  };

  return (
    <div className="editar-usuario-container">
      <h2 className="editar-usuario-titulo">Editar Usuario</h2>
      <form className="editar-usuario-form" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} />

        <label>Ubicación:</label>
        <input type="text" name="ubicacion" value={usuario.ubicacion} onChange={handleChange} />

        <label>Empresa:</label>
        <input type="text" name="empresas" value={usuario.empresas} onChange={handleChange} />

        <label>Unidad de Negocio:</label>
        <input type="text" name="unidades_negocio" value={usuario.unidades_negocio} onChange={handleChange} />

        <button className="btn-guardar" type="submit">Guardar Cambios</button>
        <button className="btn-cancelar" type="button" onClick={() => navigate("/usuarios")}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarUsuario;

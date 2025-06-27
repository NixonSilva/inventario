import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarEquipos.css";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/actualizarEquipo.php";

const EditarEquipos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState({
    usuario: "",
    ubicacion: "",
    lugar_uso: "",
    tipo_equipo: "",
    marca: "",
    cpu: "",
    anydesk: "",
    ram: "",
    estado: "",
    hdd: "",
    observacion: "",
    ssd: "",
    serial: "",
    propietario: "",
    fecha_entrega: "",
  });

  useEffect(() => {
    axios.get(`${API_URL}?id=${id}`)
      .then((res) => {
        if (res.data && res.data.equipo) {
          setEquipo(res.data.equipo);
        }
      })
      .catch((err) => console.error("Error al obtener equipo", err));
  }, [id]);

  const handleChange = (e) => {
    setEquipo({ ...equipo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL, {
      action: "actualizar",
      id,
      ...equipo
    })
    .then(() => {
      alert("Equipo actualizado correctamente");
      navigate("/equipos");
    })
    .catch((err) => console.error("Error al actualizar equipo", err));
  };

  return (
    <div className="formulario-editar-container">
      <h2>Editar Equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo-formulario">
          <label>Usuario:</label>
          <input type="text" name="usuario" value={equipo.usuario} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Ubicación:</label>
          <input type="text" name="ubicacion" value={equipo.ubicacion} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Lugar de Uso:</label>
          <input type="text" name="lugar_uso" value={equipo.lugar_uso} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Tipo de Equipo:</label>
          <input type="text" name="tipo_equipo" value={equipo.tipo_equipo} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Marca:</label>
          <input type="text" name="marca" value={equipo.marca} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>CPU:</label>
          <input type="text" name="cpu" value={equipo.cpu} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Anydesk:</label>
          <input type="text" name="anydesk" value={equipo.anydesk} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>RAM:</label>
          <input type="text" name="ram" value={equipo.ram} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Estado:</label>
          <input type="text" name="estado" value={equipo.estado} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>HDD:</label>
          <input type="text" name="hdd" value={equipo.hdd} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>SSD:</label>
          <input type="text" name="ssd" value={equipo.ssd} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Observación:</label>
          <input type="text" name="observacion" value={equipo.observacion} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Serial:</label>
          <input type="text" name="serial" value={equipo.serial} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Propietario:</label>
          <input type="text" name="propietario" value={equipo.propietario} onChange={handleChange} />
        </div>
        <div className="campo-formulario">
          <label>Fecha de Entrega:</label>
          <input type="text" name="fecha_entrega" value={equipo.fecha_entrega} onChange={handleChange} />
        </div>

        <div className="botonera">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate("/equipos")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarEquipos;

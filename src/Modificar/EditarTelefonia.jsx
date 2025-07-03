import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarTelefonia.css";

const API_URL = "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/actualizarTelefonia.php";
const CONSULTA_API = "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/obtenerTelefonia.php";

const EditarTelefonia = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    usuarios: "",
    empresa: "",
    ciudad: "",
    lugar: "",
    extension: "",
    contrasena: "",
    zoiper: "",
    marca: "",
    modelo: "",
    ip: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarTelefonia = async () => {
      if (!id) {
        setError("ID de teléfono no encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          CONSULTA_API,
          { id: parseInt(id, 10) },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000
          }
        );

        if (response.data && response.data.telefonia) {
          const telefonia = response.data.telefonia;
          setFormData({
            id: id.toString(),
            usuarios: telefonia.usuarios || "",
            empresa: telefonia.empresa || "",
            ciudad: telefonia.ciudad || "",
            lugar: telefonia.lugar || "",
            extension: telefonia.extension || "",
            contrasena: telefonia.contrasena || "",
            zoiper: telefonia.zoiper || "",
            marca: telefonia.marca || "",
            modelo: telefonia.modelo || "",
            ip: telefonia.ip || ""
          });
        } else {
          throw new Error("No se encontraron datos del teléfono en la respuesta");
        }
      } catch (error) {
        setError("Error al cargar los datos: " + (error.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

    cargarTelefonia();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const datosParaEnviar = {
        ...formData,
        id: parseInt(formData.id, 10),
        ip: formData.ip.trim()
      };

      const response = await axios.post(API_URL, datosParaEnviar, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000
      });

      if (response.data.mensaje || response.data.success) {
        alert(response.data.mensaje || "Teléfono actualizado correctamente.");
        navigate("/telefonia");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar teléfono: " + (error.response?.data?.mensaje || error.message));
    }
  };

  if (loading) {
    return (
      <div className="form2-container">
        <h2>Cargando datos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form2-container">
        <h2>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <div className="form-buttons">
          <button onClick={() => navigate("/telefonia")}>Volver</button>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form2-container">
      <h2>Editar Teléfono (ID: {formData.id})</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={formData.id} />

        <div className="form-grid">
          <label>Usuario:
            <input type="text" name="usuarios" value={formData.usuarios} onChange={handleChange} maxLength="100" />
          </label>

          <label>Empresa:
            <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} maxLength="100" />
          </label>

          <label>Ciudad:
            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} maxLength="100" />
          </label>

          <label>Lugar:
            <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} maxLength="100" />
          </label>

          <label>Extensión:
            <input type="text" name="extension" value={formData.extension} onChange={handleChange} maxLength="10" />
          </label>

          <label>Contraseña:
            <input type="text" name="contrasena" value={formData.contrasena} onChange={handleChange} maxLength="50" />
          </label>

          <label>Zoiper:
            <input type="text" name="zoiper" value={formData.zoiper} onChange={handleChange} maxLength="50" />
          </label>

          <label>Marca:
            <input type="text" name="marca" value={formData.marca} onChange={handleChange} maxLength="100" />
          </label>

          <label>Modelo:
            <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} maxLength="100" />
          </label>

          <label>IP:
            <input type="text" name="ip" value={formData.ip} onChange={handleChange} placeholder="192.168.1.1" />
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate("/telefonia")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarTelefonia;

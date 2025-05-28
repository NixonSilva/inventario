import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/styles_4.css";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:3000/api/telefonia"; // Cambia la URL de la API a la de telefonía

const Telefonia = () => {
  const [telefonos, setTelefonos] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    empresa: "",
    ciudad: "",
    lugar: "",
    extension: "",
  });

  const obtenerTelefonos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${paginaActual}&limit=10`);
      setTelefonos(response.data.datos);
      setTotalPaginas(response.data.totalPaginas);
    } catch (error) {
      console.error("Error al obtener teléfonos:", error);
    }
  }, [paginaActual]);

  useEffect(() => {
    obtenerTelefonos();
  }, [obtenerTelefonos]);

  const aplicarFiltros = () => {
    return telefonos.filter((telefono) => {
      return (
        (telefono.usuario || "").toLowerCase().includes(filtros.usuario.toLowerCase()) &&
        (telefono.empresa || "").toLowerCase().includes(filtros.empresa.toLowerCase()) &&
        (telefono.ciudad || "").toLowerCase().includes(filtros.ciudad.toLowerCase()) &&
        (telefono.lugar || "").toLowerCase().includes(filtros.lugar.toLowerCase()) &&
        (telefono.extension || "").toLowerCase().includes(filtros.extension.toLowerCase())
      );
    });
  };

  const limpiarFiltros = () => {
    setFiltros({ usuario: "", empresa: "", ciudad: "", lugar: "", extension: "" });
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };
  const toggleFila = (id) => {
    setFilasExpandida((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // ➕ Función para redirigir a edición (puedes cambiar a abrir modal si usas uno)
  const abrirModal = (telefono) => {
    navigate(`/Formularios/telefonia/${telefono.id}`);
  };

  // ➖ Función para eliminar telefono desde la fila
  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerTelefonos();
    } catch (error) {
      console.error("Error al eliminar telefonos:", error);
    }
  };
  return (
    <div className="container">
      <h2>Lista de Teléfonos</h2>
      <div className="texto_explicativo">
         <p>En esta sección encontraras toda la información relacionada a la asignación de telefonos y sus diferentes especificaciones</p>
      </div>

      <div className="filtros-container">
        <input type="text" name="usuario" placeholder="Filtrar por usuario" value={filtros.usuario} onChange={handleInputChange} />
        <input type="text" name="empresa" placeholder="Filtrar por empresa" value={filtros.empresa} onChange={handleInputChange} />
        <input type="text" name="ciudad" placeholder="Filtrar por ciudad" value={filtros.ciudad} onChange={handleInputChange} />
        <input type="text" name="lugar" placeholder="Filtrar por lugar" value={filtros.lugar} onChange={handleInputChange} />
        <input type="text" name="extension" placeholder="Filtrar por extensión" value={filtros.extension} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro"/></button>
        <button className="btn-estilo" onClick={() => navigate("/Formularios/telefonia")}>+ Teléfono</button>
      </div>

      {telefonos.length === 0 && <p>No se encontraron teléfonos o no hay datos aún.</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Empresa</th>
            <th>Ciudad</th>
            <th>Lugar</th>
            <th>Extensión</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
        {aplicarFiltros().map((telefono) => (
          <React.Fragment key={telefono.id}>
            <tr className="fila-con-linea">
              <td>{telefono.id}</td>
              <td>{telefono.usuario}</td>
              <td>{telefono.empresa}</td>
              <td>{telefono.ciudad}</td>
              <td>{telefono.lugar}</td>
              <td>{telefono.extension}</td>
              <td>
                <div className="botones-acciones">
                  <button className="btn-ver" onClick={() => toggleFila(telefono.id)}>
                    <FaEye />
                  </button>
                  <button className="btn-editar" onClick={() => abrirModal(telefono)}>
                    <FaEdit />
                  </button>
                  <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(telefono.id)}>
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>

            {filasExpandida.includes(telefono.id) && (
              <tr className="fila-expandida">
                <td colSpan="9">
                  <table className="info-expandida">
                    <tbody className="tablaExpandida">
                      <tr>
                        <td><strong>Contraseña:</strong></td>
                        <td>{telefono.contrasena || "No especificado"}</td>
                        <td><strong>Zoyper:</strong></td>
                        <td>{telefono.zoyper || "No especificado"}</td>
                      </tr>
                      <tr>
                        <td><strong>Marca:</strong></td>
                        <td>{telefono.marca || "No especificado"}</td>
                        <td><strong>Modelo:</strong></td>
                        <td>{telefono.modelo || "No especificado"}</td>
                      </tr>
                      <tr>
                        <td><strong>IP:</strong></td>
                        <td>{telefono.ip || "No especificado"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        </tbody>
      </table>

      <div className="paginacion-mejorada">
        <button onClick={() => cambiarPagina(1)} disabled={paginaActual === 1}>{"<<"}</button>
        <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>{"<"}</button>

        {(() => {
          const paginas = [];
          const inicio = Math.max(1, paginaActual - 1);
          const fin = Math.min(totalPaginas, inicio + 2);

          for (let i = inicio; i <= fin; i++) {
            paginas.push(
              <button key={i} onClick={() => cambiarPagina(i)} className={i === paginaActual ? "pagina-activa" : ""}>{i}</button>
            );
          }

          return paginas;
        })()}

        <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>{">"}</button>
        <button onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas}>{">>"}</button>
      </div>
    </div>
  );
};

export default Telefonia;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/styles_2.css";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/equipos.php";

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    ubicacion: "",
    tipo: ""
  });

  const obtenerEquipos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${paginaActual}&limit=10`);
      const datos = Array.isArray(response.data.datos) ? response.data.datos : [];
      setEquipos(datos);
      setTotalPaginas(response.data.totalPaginas || 1);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
      setEquipos([]);
      setTotalPaginas(1);
    }
  }, [paginaActual]);

  useEffect(() => {
    obtenerEquipos();
  }, [obtenerEquipos]);

  const aplicarFiltros = () => {
    return equipos.filter((equipo) => {
      return (
        (equipo.usuarios || "").toLowerCase().includes(filtros.usuario.toLowerCase()) &&
        (equipo.ubicacion || "").toLowerCase().includes(filtros.ubicacion.toLowerCase()) &&
        (equipo.tipo_equipo || "").toLowerCase().includes(filtros.tipo.toLowerCase()) 
      );
    });
  };

  const limpiarFiltros = () => {
    setFiltros({ usuario: "", ubicacion: "", tipo: ""});
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
  const abrirModal = (equipo) => {
    navigate(`/Formularios/equipos/${equipo.id}`);
  };

  // ➖ Función para eliminar equipo desde la fila
  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerEquipos();
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Equipos</h2>
      <div className="texto_explicativo">
        <p>En esta sección encontrarás los respectivos equipos asignados con su usuario responsable</p>
      </div>

      <div className="filtros-container">
        <input type="text" name="usuario" placeholder="Filtrar por usuario" value={filtros.usuario} onChange={handleInputChange} />
        <input type="text" name="ubicacion" placeholder="Filtrar por ubicación" value={filtros.ubicacion} onChange={handleInputChange} />
        <input type="text" name="tipo" placeholder="Filtrar por tipo" value={filtros.tipo} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro" /></button>
        <button className="btn-estilo" onClick={() => navigate("/Formularios/equipos")}>+ Equipo</button>
      </div>

      {Array.isArray(equipos) && equipos.length === 0 && (
        <p>No se encontraron equipos o no hay datos aún.</p>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Ubicación</th>
            <th>Lugar de Uso</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>CPU</th>
            <th>Serial</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
          {aplicarFiltros().map((equipo) => (
            <React.Fragment key={equipo.id}>
              <tr className="fila-con-linea">
                <td>{equipo.id}</td>
                <td>{equipo.usuario}</td>
                <td>{equipo.ubicacion}</td>
                <td>{equipo.lugar_uso}</td>
                <td>{equipo.tipo_equipo}</td>
                <td>{equipo.marca}</td>
                <td>{equipo.cpu}</td>
                <td>{equipo.serial}</td>
                <td>
                  <div className="botones-acciones">
                    <button className="btn-ver" onClick={() => toggleFila(equipo.id)}>
                      <FaEye />
                    </button>
                    <button className="btn-editar" onClick={() => abrirModal(equipo)}>
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(equipo.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>

              {filasExpandida.includes(equipo.id) && (
                <tr className="fila-expandida">
                  <td colSpan="9">
                    <table className="info-expandida">
                      <tbody className="tablaExpandida">
                        <tr>
                          <td><strong>RAM:</strong></td>
                          <td>{equipo.memoria_ram || "No especificado"}</td>
                          <td><strong>Estado:</strong></td>
                          <td>{equipo.estado || "No especificado"}</td>
                          <td><strong>Propietario:</strong></td>
                          <td>{equipo.propietario || "No especificado"}</td>
                        </tr>
                        <tr>
                          <td><strong>HDD:</strong></td>
                          <td>{equipo.disco_mecanico || "No especificado"}</td>
                          <td><strong>Observación:</strong></td>
                          <td>{equipo.observacion || "No especificado"}</td>
                          <td><strong>Fecha Entrega:</strong></td>
                          <td>{equipo.fecha_entrega || "No especificado"}</td>
                        </tr>
                        <tr>
                          <td><strong>SSD:</strong></td>
                          <td>{equipo.disco_ssd || "No especificado"}</td>
                          <td><strong>Fecha Mantenimiento:</strong></td>
                          <td>{equipo.fecha_mantenimiento || "No especificado"}</td>
                          <td><strong>Fecha Devolución:</strong></td>
                          <td>{equipo.fecha_devolucion || "No especificado"}</td>
                        </tr>
                        <tr>
                          <td><strong>IP:</strong></td>
                          <td>{equipo.ip || "No especificado"}</td>
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

export default Equipos;

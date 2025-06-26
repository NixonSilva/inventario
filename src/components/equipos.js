import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/styles_2.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/equipos.php";

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    ubicacion: "",
    tipo: "",
  });

  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const obtenerEquipos = async () => {
    try {
      const response = await axios.get(API_URL);
      const datos = Array.isArray(response.data.equipos) ? response.data.equipos : [];
      setEquipos(datos);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
    }
  };

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const equiposFiltrados = useMemo(() => {
    return equipos.filter((equipo) => {
      return (
        (equipo.usuario || "").toLowerCase().includes(filtros.usuario.toLowerCase()) &&
        (equipo.ubicacion || "").toLowerCase().includes(filtros.ubicacion.toLowerCase()) &&
        (equipo.tipo_equipo || "").toLowerCase().includes(filtros.tipo.toLowerCase())
      );
    });
  }, [equipos, filtros]);

  const totalPages = Math.ceil(equiposFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equiposFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const limpiarFiltros = () => {
    setFiltros({ usuario: "", ubicacion: "", tipo: "" });
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const toggleFila = (id) => {
    setFilasExpandida((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const abrirModal = (equipo) => {
    navigate(`/Formularios/equipos/${equipo.id}`);
  };

  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerEquipos();
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const getVisiblePages = () => {
    const visibleCount = 3;
    let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
    let end = start + visibleCount - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visibleCount + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container">
      <h2>Lista de Equipos</h2>
      <div className="texto_explicativo">
        <p>En esta sección encontrarás los respectivos equipos asignados con su usuario responsable</p>
      </div>
      
      <div className="contenedor-centro">
        <button className="boton-estilo" onClick={() => navigate("/")}>Inicio</button>
      </div>

      <div className="filtros-container">
        <input type="text" name="usuario" placeholder="Filtrar por usuario" value={filtros.usuario} onChange={handleInputChange} />
        <input type="text" name="ubicacion" placeholder="Filtrar por ubicación" value={filtros.ubicacion} onChange={handleInputChange} />
        <input type="text" name="tipo" placeholder="Filtrar por tipo" value={filtros.tipo} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro" /></button>
        <button className="btn-estilo" onClick={() => navigate("/BuscarUsuario")}>+ Equipo</button>
      </div>

      {equipos.length === 0 && <p>No se encontraron equipos o no hay datos aún.</p>}

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
            <th>Anydesk</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((equipo) => (
            <React.Fragment key={equipo.id}>
              <tr className="fila-con-linea">
                <td>{equipo.EQUIPO_ID}</td>
                <td>{equipo.USUARIO}</td>
                <td>{equipo.UBICACION}</td>
                <td>{equipo.LUGAR_USO}</td>
                <td>{equipo.TIPO_EQUIPO}</td>
                <td>{equipo.MARCA}</td>
                <td>{equipo.CPU}</td>
                <td>{equipo.ANYDESK}</td>
                <td>
                  <div className="botones-acciones">
                    <button className="btn-ver" onClick={() => toggleFila(equipo.id)}><FaEye /></button>
                    <button className="btn-editar" onClick={() => abrirModal(equipo)}><FaEdit /></button>
                    <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(equipo.id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>

              {filasExpandida.includes(equipo.id) && (
                <tr className="fila-expandida" key={`expandida-${equipo.id}`}>
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
                          <td>{equipo.disco_solido || "No especificado"}</td>
                          <td><strong>SERIAL:</strong></td>
                          <td>{equipo.SERIAL || "No especificado"}</td>
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

      {equiposFiltrados.length > itemsPerPage && (
        <div className="paginacion-mejorada">
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>&laquo;</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&lsaquo;</button>

          {getVisiblePages().map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? "pagina-activa" : ""}
            >
              {number}
            </button>
          ))}

          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&rsaquo;</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
        </div>
      )}
    </div>
  );
};

export default Equipos;

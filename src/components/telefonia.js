import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/styles_4.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/telefonia.php";

const Telefonia = () => {
  const [telefonos, setTelefonos] = useState([]);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    empresa: "",
    ciudad: "",
    lugar: "",
    extension: "",
  });

  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const obtenerTelefonos = async () => {
    try {
      const response = await axios.get(API_URL);
      const datos = Array.isArray(response.data.telefonia) ? response.data.telefonia : [];
      setTelefonos(datos);
    } catch (error) {
      console.error("Error al obtener teléfonos:", error);
    }
  };

  useEffect(() => {
    obtenerTelefonos();
  }, []);

  const telefonosFiltrados = useMemo(() => {
    return telefonos.filter((telefono) => {
      return (
        (telefono.usuario || "").toLowerCase().includes(filtros.usuario.toLowerCase()) &&
        (telefono.empresa || "").toLowerCase().includes(filtros.empresa.toLowerCase()) &&
        (telefono.ciudad || "").toLowerCase().includes(filtros.ciudad.toLowerCase()) &&
        (telefono.lugar || "").toLowerCase().includes(filtros.lugar.toLowerCase()) &&
        (telefono.extension || "").toLowerCase().includes(filtros.extension.toLowerCase())
      );
    });
  }, [telefonos, filtros]);

  const totalPages = Math.ceil(telefonosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = telefonosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const limpiarFiltros = () => {
    setFiltros({ usuario: "", empresa: "", ciudad: "", lugar: "", extension: "" });
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

  const abrirModal = (telefono) => {
    navigate(`/Formularios/telefonia/${telefono.id}`);
  };

  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerTelefonos();
    } catch (error) {
      console.error("Error al eliminar teléfono:", error);
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
      <h2>Lista de Teléfonos</h2>
      <div className="texto_explicativo">
        <p>En esta sección encontrarás toda la información relacionada a la asignación de teléfonos y sus diferentes especificaciones</p>
      </div>

      <div className="contenedor-centro">
        <button className="boton-estilo" onClick={() => navigate("/")}>Inicio</button>
      </div>

      <div className="filtros-container">
        <input type="text" name="usuario" placeholder="Filtrar por usuario" value={filtros.usuario} onChange={handleInputChange} />
        <input type="text" name="empresa" placeholder="Filtrar por empresa" value={filtros.empresa} onChange={handleInputChange} />
        <input type="text" name="ciudad" placeholder="Filtrar por ciudad" value={filtros.ciudad} onChange={handleInputChange} />
        <input type="text" name="lugar" placeholder="Filtrar por lugar" value={filtros.lugar} onChange={handleInputChange} />
        <input type="text" name="extension" placeholder="Filtrar por extensión" value={filtros.extension} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro" /></button>
        <button className="btn-estilo" onClick={() => navigate("/Rtelefonia")}>+ Teléfono</button>
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
          {currentItems.map((telefono) => (
            <React.Fragment key={telefono.id}>
              <tr className="fila-con-linea">
                <td>{telefono.TELEFONIA_ID}</td>
                <td>{telefono.NOMBRE_USUARIO}</td>
                <td>{telefono.EMPRESA}</td>
                <td>{telefono.CIUDAD}</td>
                <td>{telefono.LUGAR}</td>
                <td>{telefono.EXTENSION}</td>
                <td>
                  <div className="botones-acciones">
                    <button className="btn-ver" onClick={() => toggleFila(telefono.id)}><FaEye /></button>
                    <button className="btn-editar" onClick={() => abrirModal(telefono)}><FaEdit /></button>
                    <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(telefono.id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>

              {filasExpandida.includes(telefono.id) && (
                <tr className="fila-expandida" key={`expandida-${telefono.id}`}>
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

      {telefonosFiltrados.length > itemsPerPage && (
        <div className="paginacion-mejorada">
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>{"<<"}</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>

          {getVisiblePages().map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? "pagina-activa" : ""}
            >
              {number}
            </button>
          ))}

          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>{">>"}</button>
        </div>
      )}
    </div>
  );
};

export default Telefonia;

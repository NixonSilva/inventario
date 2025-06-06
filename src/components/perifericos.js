import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/styles_5.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/perifericos.php";

const Perifericos = () => {
  const [perifericos, setPerifericos] = useState([]);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    pantalla1: "",
    pantalla2: "",
    mouse: "",
    teclado: "",
  });

  const navigate = useNavigate();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const obtenerPerifericos = async () => {
    try {
      const response = await axios.get(API_URL);
      setPerifericos(response.data.perifericos || []);
    } catch (error) {
      console.error("Error al obtener periféricos:", error);
    }
  };

  useEffect(() => {
    obtenerPerifericos();
  }, []);

  const perifericosFiltrados = useMemo(() => {
    return perifericos.filter((item) => (
      (item.usuario_responsable || "").toLowerCase().includes(filtros.usuario.toLowerCase()) &&
      (item.pantalla_1_marca_modelo || "").toLowerCase().includes(filtros.pantalla1.toLowerCase()) &&
      (item.pantalla_2_marca_modelo || "").toLowerCase().includes(filtros.pantalla2.toLowerCase()) &&
      (item.mouse || "").toLowerCase().includes(filtros.mouse.toLowerCase()) &&
      (item.teclado || "").toLowerCase().includes(filtros.teclado.toLowerCase())
    ));
  }, [perifericos, filtros]);

  const totalPages = Math.ceil(perifericosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = perifericosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

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

  const limpiarFiltros = () => {
    setFiltros({ usuario: "", pantalla1: "", pantalla2: "", mouse: "", teclado: "" });
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

  const abrirModal = (item) => {
    navigate(`/Formularios/perifericos/${item.id}`);
  };

  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerPerifericos();
    } catch (error) {
      console.error("Error al eliminar periférico:", error);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Periféricos</h2>
      <div className="texto_explicativo">
        <p>En esta sección encontrarás toda la información relacionada a la asignación de cada uno de los periféricos.</p>
      </div>

      <div className="filtros-container">
        <input type="text" name="usuario" placeholder="Filtrar por usuario" value={filtros.usuario} onChange={handleInputChange} />
        <input type="text" name="pantalla1" placeholder="Filtrar por Pantalla 1" value={filtros.pantalla1} onChange={handleInputChange} />
        <input type="text" name="pantalla2" placeholder="Filtrar por Pantalla 2" value={filtros.pantalla2} onChange={handleInputChange} />
        <input type="text" name="mouse" placeholder="Filtrar por Mouse" value={filtros.mouse} onChange={handleInputChange} />
        <input type="text" name="teclado" placeholder="Filtrar por Teclado" value={filtros.teclado} onChange={handleInputChange} />

        <button className="btn-estilo" onClick={limpiarFiltros}>
          Limpiar <FaFilter className="icono-filtro" />
        </button>
        <button className="btn-estilo" onClick={() => navigate("/Rperifericos")}>
          + Periferico
        </button>
      </div>

      {perifericosFiltrados.length === 0 ? (
        <p>No se encontraron periféricos.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Pantalla 1</th>
              <th>Pantalla 2</th>
              <th>Mouse</th>
              <th>Teclado</th>
              <th>Más</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="fila-con-linea">
                  <td>{item.id}</td>
                  <td>{item.USUARIO_RESPONSABLE}</td>
                  <td>{item.PANTALLA_1_MARCA_MODELO || "No especificado"}</td>
                  <td>{item.PANTALLA_2_MARCA_MODELO || "No especificado"}</td>
                  <td>{item.MOUSE}</td>
                  <td>{item.TECLADO}</td>
                  <td>
                    <div className="botones-acciones">
                      <button className="btn-ver" onClick={() => toggleFila(item.id)}><FaEye /></button>
                      <button className="btn-editar" onClick={() => abrirModal(item)}><FaEdit /></button>
                      <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(item.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
                {filasExpandida.includes(item.id) && (
                  <tr className="fila-expandida">
                    <td colSpan="9">
                      <table className="info-expandida">
                        <tbody className="tablaExpandida">
                          <tr>
                            <td><strong>Diadema:</strong></td>
                            <td>{item.diadema || "No especificado"}</td>
                            <td><strong>Base refrigerante:</strong></td>
                            <td>{item.base_refigerante || "No especificado"}</td>
                          </tr>
                          <tr>
                            <td><strong>Base pantalla:</strong></td>
                            <td>{item.base_pantalla || "No especificado"}</td>
                            <td><strong>Maletín:</strong></td>
                            <td>{item.maletin || "No especificado"}</td>
                          </tr>
                          <tr>
                            <td><strong>Cámara:</strong></td>
                            <td>{item.camara_desktop || "No especificado"}</td>
                          </tr>
                          <tr>
                            <td><strong>IP:</strong></td>
                            <td>{item.ip || "No especificado"}</td>
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
      )}

      {perifericosFiltrados.length > itemsPerPage && (
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

export default Perifericos;

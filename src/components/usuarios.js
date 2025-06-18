import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/styles_1.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/usuarios.php";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    ubicacion: "",
    empresas: "",
    unidades_negocio: "",
  });

  const navigate = useNavigate();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsuarios(response.data.usuarios || []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      return (
        (usuario.nombre_usuario || "").toLowerCase().includes(filtros.nombre.toLowerCase()) &&
        (usuario.ubicaciones || "").toLowerCase().includes(filtros.ubicacion.toLowerCase()) &&
        (usuario.empresas || "").toLowerCase().includes(filtros.empresas.toLowerCase()) &&
        (usuario.unidades_negocio || "").toLowerCase().includes(filtros.unidades_negocio.toLowerCase())
      );
    });
  }, [usuarios, filtros]);

  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: "", ubicacion: "", empresas: "", unidades_negocio: "" });
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

  const abrirModal = (id) => {
    console.log(usuarios);
    navigate(`/Modificar/EditarUsuario/${id}`);
  };

  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuarios:", error);
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
      <h2>Lista de Usuarios</h2>
      <div className="texto_explicativo">
        <p>En esta sección encontrarás toda la información relacionada con los usuarios.</p>
      </div>
      <div className="contenedor-centro">
        <button className="boton-estilo" onClick={() => navigate("/")}>Inicio</button>
      </div>

      <div className="filtros-container">
        <input type="text" name="nombre" placeholder="Filtrar por nombre" value={filtros.nombre} onChange={handleInputChange} />
        <input type="text" name="ubicacion" placeholder="Filtrar por ciudad" value={filtros.ubicacion} onChange={handleInputChange} />
        <input type="text" name="empresas" placeholder="Filtrar por empresa" value={filtros.empresas} onChange={handleInputChange} />
        <input type="text" name="unidades_negocio" placeholder="Filtrar por unidad de negocio" value={filtros.unidades_negocio} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro" /></button>
        <button className="btn-estilo" onClick={() => navigate("/Rusuarios")}>+ Usuario</button>
      </div>

      {usuarios.length === 0 && <p>No se encontraron usuarios o no hay datos aún.</p>}

      <table>
        <thead>
          <tr>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Empresa</th>
            <th>Unidad de Negocio</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((usuario) => (
            <React.Fragment key={usuario.usuario_id}>
              <tr className="fila-con-linea">
                <td>{usuario.usuario_id}</td>
                <td>{usuario.nombre_usuario}</td>
                <td>{usuario.ubicaciones}</td>
                <td>{usuario.empresas}</td>
                <td>{usuario.unidades_negocio}</td>
                <td>
                  <div className="botones-acciones">
                    <button className="btn-ver" onClick={() => toggleFila(usuario.id)}>
                      <FaEye />
                    </button>
                    <button className="btn-editar" onClick={() => abrirModal(usuario.usuario_id)}>
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(usuario.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>

              {filasExpandida.includes(usuario.id) && (
                <tr className="fila-expandida">
                  <td colSpan="6">
                    <table className="info-expandida">
                      <tbody className="tablaExpandida">
                        <tr>
                          <td>Correo electrónico</td>
                          <td>{usuario.correo_electronico || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td>Teléfono</td>
                          <td>{usuario.telefono || 'No especificado'}</td>
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

      {/* Paginación con solo 3 botones visibles */}
      {usuariosFiltrados.length > itemsPerPage && (
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

export default Usuarios;

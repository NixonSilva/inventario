import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/styles_6.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../AutoContext";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/impresoras.php";

const Impresoras = () => {
  const { user } = useAuth();
  const [impresoras, setImpresoras] = useState([]);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    ciudad: "",
    empresa: "",
    usuario_responsable: "",
    marca_modelo: "",
    serial: "",
    estado: "",
  });

  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const obtenerImpresoras = async () => {
    try {
      const response = await axios.get(API_URL);
      const datos = Array.isArray(response.data.impresoras) ? response.data.impresoras : [];
      setImpresoras(datos);
    } catch (error) {
      console.error("Error al obtener impresoras:", error);
    }
  };

  useEffect(() => {
    obtenerImpresoras();
  }, []);

  const impresorasFiltradas = useMemo(() => {
    return impresoras
      .filter((imp) => imp.activo === 'Y') // ✅ solo activas
      .filter((imp) => {
        return (
          (imp.ciudad || "").toLowerCase().includes(filtros.ciudad.toLowerCase()) &&
          (imp.empresa || "").toLowerCase().includes(filtros.empresa.toLowerCase()) &&
          (imp.usuario_responsable || "").toLowerCase().includes(filtros.usuario_responsable.toLowerCase()) &&
          (imp.marca_modelo || "").toLowerCase().includes(filtros.marca_modelo.toLowerCase()) &&
          (imp.serial || "").toLowerCase().includes(filtros.serial.toLowerCase()) &&
          (imp.estado || "").toLowerCase().includes(filtros.estado.toLowerCase())
        );
      });
  }, [impresoras, filtros]);

  const totalPages = Math.ceil(impresorasFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = impresorasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const limpiarFiltros = () => {
    setFiltros({
      ciudad: "",
      empresa: "",
      usuario_responsable: "",
      marca_modelo: "",
      serial: "",
      estado: "",
    });
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
    navigate(`/Modificar/Editarimpresoras/${id}`);
  };

  const handleEliminarDesdeFila = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas desactivar esta impresora?");
    if (!confirmacion) return;

    try {
      await axios.delete(API_URL, { data: { id } });
      obtenerImpresoras();
    } catch (error) {
      console.error("Error al desactivar impresora:", error);
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
      <h2>Lista de Impresoras</h2>
      <div className="texto_explicativo">
        <p>En esta sección encontrarás las impresoras registradas con sus detalles.</p>
      </div>

      <div className="contenedor-centro">
        <button className="boton-estilo" onClick={() => navigate("/")}>Inicio</button>
      </div>

      <div className="filtros-container">
        <input type="text" name="ciudad" placeholder="Filtrar por ciudad" value={filtros.ciudad} onChange={handleInputChange} />
        <input type="text" name="empresa" placeholder="Filtrar por empresa" value={filtros.empresa} onChange={handleInputChange} />
        <input type="text" name="usuario_responsable" placeholder="Filtrar por usuario responsable" value={filtros.usuario_responsable} onChange={handleInputChange} />
        <input type="text" name="marca_modelo" placeholder="Filtrar por marca/modelo" value={filtros.marca_modelo} onChange={handleInputChange} />
        <input type="text" name="serial" placeholder="Filtrar por serial" value={filtros.serial} onChange={handleInputChange} />
        <input type="text" name="estado" placeholder="Filtrar por estado" value={filtros.estado} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro" /></button>
        {user.permite_insertar === "Y" &&
          <button className="btn-estilo" onClick={() => navigate("/BuscarUsuarioi")}>+ Impresora</button>
        }
      </div>

      {impresoras.length === 0 && <p>No se encontraron impresoras o no hay datos aún.</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ciudad</th>
            <th>Empresa</th>
            <th>Usuario Responsable</th>
            <th>Marca / Modelo</th>
            <th>Serial</th>
            <th>Estado</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((impresora) => (
            <React.Fragment key={impresora.id}>
              <tr className="fila-con-linea">
                <td>{impresora.id}</td>
                <td>{impresora.ciudad}</td>
                <td>{impresora.empresa}</td>
                <td>{impresora.usuario_responsable}</td>
                <td>{impresora.marca_modelo}</td>
                <td>{impresora.serial}</td>
                <td>{impresora.estado}</td>
                <td>
                  <div className="botones-acciones">
                    <button className="btn-ver" onClick={() => toggleFila(impresora.id)}><FaEye /></button>
                    {user.permite_modificar === "Y" && (
                      <button className="btn-editar" onClick={() => abrirModal(impresora.id)}><FaEdit /></button>
                    )}
                    {user.permite_desactivar === "Y" && (
                      <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(impresora.id)}><FaTrash /></button>
                    )}
                  </div>
                </td>
              </tr>

              {filasExpandida.includes(impresora.id) && (
                <tr className="fila-expandida" key={`expandida-${impresora.id}`}>
                  <td colSpan="8">
                    <table className="info-expandida">
                      <tbody className="tablaExpandida">
                        <tr>
                          <td><strong>IP:</strong></td>
                          <td>{impresora.ip || "No especificado"}</td>
                          <td><strong>Propietario:</strong></td>
                          <td>{impresora.propietario || "No especificado"}</td>
                          <td><strong>Fecha Cambio Tóner:</strong></td>
                          <td>{impresora.fechaCambioToner || "No especificado"}</td>
                        </tr>
                        <tr>
                          <td><strong>Mantenimiento:</strong></td>
                          <td>{impresora.fechaMantenimiento || "No especificado"}</td>
                          <td><strong>Observación:</strong></td>
                          <td colSpan="3">{impresora.observacion || "No especificado"}</td>
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

      {impresorasFiltradas.length > itemsPerPage && (
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

export default Impresoras;

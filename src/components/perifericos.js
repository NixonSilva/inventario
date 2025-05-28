import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/styles_5.css";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:3000/api/perifericos";

const Perifericos = () => {
  const [perifericos, setPerifericos] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filasExpandida, setFilasExpandida] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    pantalla1: "",
    pantalla2: "",
    mouse: "",
    teclado: ""
  });

  const obtenerPerifericos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${paginaActual}&limit=10`);
      const datos = response.data?.datos ?? []; // Asegura que siempre sea array
      const total = response.data?.totalPaginas ?? 1; // Valor por defecto si no llega
      setPerifericos(datos);
      setTotalPaginas(total);
    } catch (error) {
      console.error("Error al obtener periféricos:", error);
      setPerifericos([]); // fallback para evitar errores si falla la carga
    }
  }, [paginaActual]);

  useEffect(() => {
    obtenerPerifericos();
  }, [obtenerPerifericos]);

  const aplicarFiltros = () => {
    return (perifericos ?? []).filter((item) => {
      return (
        (item.usuario_responsable || "").toLowerCase().includes(filtros.usuario.toLowerCase()) &&
        (item.pantalla_1_marca_modelo || "").toLowerCase().includes(filtros.pantalla1.toLowerCase()) &&
        (item.pantalla_2_marca_modelo || "").toLowerCase().includes(filtros.pantalla2.toLowerCase()) &&
        (item.mouse || "").toLowerCase().includes(filtros.mouse.toLowerCase()) &&
        (item.teclado || "").toLowerCase().includes(filtros.teclado.toLowerCase())
      );
    });
  };

  const limpiarFiltros = () => {
    setFiltros({ usuario: "", pantalla1: "", pantalla2: "", mouse: "", teclado: "" });
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
  const abrirModal = (perifericos) => {
    navigate(`/Formularios/perifericos/${perifericos.id}`);
  };

  // ➖ Función para eliminar equipo desde la fila
  const handleEliminarDesdeFila = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerPerifericos();
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Periféricos</h2>
      <div className="texto_explicativo">
         <p>En esta sección encontraras toda la información relacionada a la asignación de cada uno de los perifericos</p>
      </div>

      <div className="filtros-container">
        <input
          type="text"
          name="usuario"
          placeholder="Filtrar por usuario"
          value={filtros.usuario}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="pantalla1"
          placeholder="Filtrar por Pantalla 1"
          value={filtros.pantalla1}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="pantalla2"
          placeholder="Filtrar por Pantalla 2"
          value={filtros.pantalla2}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="mouse"
          placeholder="Filtrar por Mouse"
          value={filtros.mouse}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="teclado"
          placeholder="Filtrar por Teclado"
          value={filtros.teclado}
          onChange={handleInputChange}
        />
        <button className="btn-estilo" onClick={limpiarFiltros}>
          Limpiar <FaFilter className="icono-filtro" />
        </button>
        <button className="btn-estilo" onClick={() => navigate("/Formularios/perifericos")}>
          + Agregar
        </button>
      </div>

      {(perifericos?.length ?? 0) === 0 && <p>No se encontraron periféricos o no hay datos aún.</p>}

      {(perifericos?.length ?? 0) > 0 && (
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
            {aplicarFiltros().map((item) => (
              <React.Fragment key={perifericos.id}>
                <tr key={item.id} className="fila-con-linea">
                  <td>{item.id}</td>
                  <td>{item.usuario_responsable}</td>
                  <td>{item.pantalla_1_marca_modelo}</td>
                  <td>{item.pantalla_2_marca_modelo}</td>
                  <td>{item.mouse}</td>
                  <td>{item.teclado}</td>
                  <td>
                    <div className="botones-acciones">
                      <button className="btn-ver" onClick={() => toggleFila(perifericos.id)}>
                        <FaEye />
                      </button>
                      <button className="btn-editar" onClick={() => abrirModal(perifericos)}>
                        <FaEdit />
                      </button>
                      <button className="btn-eliminar" onClick={() => handleEliminarDesdeFila(perifericos.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
                {filasExpandida.includes(perifericos.id) && (
                  <tr className="fila-expandida">
                    <td colSpan="9">
                      <table className="info-expandida">
                        <tbody className="tablaExpandida">
                          <tr>
                            <td><strong>Diadema:</strong></td>
                            <td>{perifericos.diadema || "No especificado"}</td>
                            <td><strong>Base refrigerante:</strong></td>
                            <td>{perifericos.base_refigerante|| "No especificado"}</td>
                          </tr>
                          <tr>
                            <td><strong>Base pantalla:</strong></td>
                            <td>{perifericos.base_pantalla || "No especificado"}</td>
                            <td><strong>Maletin:</strong></td>
                            <td>{perifericos.maletin || "No especificado"}</td>
                          </tr>
                          <tr>
                            <td><strong>Camara:</strong></td>
                            <td>{perifericos.camara_desktop || "No especificado"}</td>
                          </tr>
                          <tr>
                            <td><strong>IP:</strong></td>
                            <td>{perifericos.ip || "No especificado"}</td>
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

export default Perifericos;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/styles_6.css";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

const API_URL = "http://localhost:3000/api/impresoras";

const Impresoras = () => {
  const [impresoras, setImpresoras] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [modalImpresora, setModalImpresora] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [impresoraEditada, setImpresoraEditada] = useState({});
  const [filtros, setFiltros] = useState({
    ciudad: "",
    empresa: "",
    usuarioResponsable: "",
    marcaModelo: "",
    serial: "",
    estado: "",
  });

  const obtenerImpresoras = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${paginaActual}&limit=10`);
      setImpresoras(response.data.datos);
      setTotalPaginas(response.data.totalPaginas);
    } catch (error) {
      console.error("Error al obtener impresoras:", error);
    }
  }, [paginaActual]);

  useEffect(() => {
    obtenerImpresoras();
  }, [obtenerImpresoras]);

  const aplicarFiltros = () => {
    return impresoras.filter((impresora) => {
      return (
        (impresora.ciudad || "").toLowerCase().includes(filtros.ciudad.toLowerCase()) &&
        (impresora.empresa || "").toLowerCase().includes(filtros.empresa.toLowerCase()) &&
        (impresora.usuarioResponsable || "").toLowerCase().includes(filtros.usuarioResponsable.toLowerCase()) &&
        (impresora.marcaModelo || "").toLowerCase().includes(filtros.marcaModelo.toLowerCase()) &&
        (impresora.serial || "").toLowerCase().includes(filtros.serial.toLowerCase()) &&
        (impresora.estado || "").toLowerCase().includes(filtros.estado.toLowerCase())
      );
    });
  };

  const limpiarFiltros = () => {
    setFiltros({ ciudad: "", empresa: "", usuarioResponsable: "", marcaModelo: "", serial: "", estado: "" });
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const abrirModal = (impresora) => {
    setModalImpresora(impresora);
    setImpresoraEditada(impresora);
    setModoEdicion(false);
  };

  const cerrarModal = () => {
    setModalImpresora(null);
    setModoEdicion(false);
  };

  const handleEditar = () => {
    setModoEdicion(true);
  };

  const handleGuardar = async () => {
    try {
      await axios.put(`${API_URL}/${impresoraEditada.id}`, impresoraEditada);
      obtenerImpresoras();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const handleEliminar = async () => {
    try {
      await axios.delete(`${API_URL}/${modalImpresora.id}`);
      obtenerImpresoras();
      cerrarModal();
    } catch (error) {
      console.error("Error al eliminar impresora:", error);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Impresoras</h2>
      <div className="texto_explicativo">
         <p>En esta sección encontraras toda la información relacionada a las impresoras</p>
      </div>

      <div className="filtros-container">
        <input type="text" name="ciudad" placeholder="Filtrar por ciudad" value={filtros.ciudad} onChange={handleInputChange} />
        <input type="text" name="empresa" placeholder="Filtrar por empresa" value={filtros.empresa} onChange={handleInputChange} />
        <input type="text" name="usuarioResponsable" placeholder="Filtrar por usuario responsable" value={filtros.usuarioResponsable} onChange={handleInputChange} />
        <input type="text" name="marcaModelo" placeholder="Filtrar por marca/modelo" value={filtros.marcaModelo} onChange={handleInputChange} />
        <input type="text" name="serial" placeholder="Filtrar por serial" value={filtros.serial} onChange={handleInputChange} />
        <input type="text" name="estado" placeholder="Filtrar por estado" value={filtros.estado} onChange={handleInputChange} />
        <button className="btn-estilo" onClick={limpiarFiltros}>Limpiar <FaFilter className="icono-filtro"/></button>
        <button className="btn-estilo" onClick={() => navigate("/Formularios/impresoras")}>+Impresora</button>
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
            <th>IP</th>
            <th>Estado</th>
            <th>Fecha Cambio Toner</th>
            <th>Observación</th>
            <th>Fecha Mantenimiento</th>
            <th>Propietario</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
          {aplicarFiltros().map((impresora) => (
            <tr key={impresora.id} className="fila-con-linea">
              <td>{impresora.id}</td>
              <td>{impresora.ciudad}</td>
              <td>{impresora.empresa}</td>
              <td>{impresora.usuarioResponsable}</td>
              <td>{impresora.marcaModelo}</td>
              <td>{impresora.serial}</td>
              <td>{impresora.ip}</td>
              <td>{impresora.estado}</td>
              <td>{impresora.fechaCambioToner}</td>
              <td>{impresora.observacion}</td>
              <td>{impresora.fechaMantenimiento}</td>
              <td>{impresora.propietario}</td>
              <td><button className="btn-mas" onClick={() => abrirModal(impresora)}>⋯</button></td>
            </tr>
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

      {modalImpresora && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Detalles de la Impresora</h3>
            {modoEdicion ? (
              <>
                <input value={impresoraEditada.ciudad} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, ciudad: e.target.value })} />
                <input value={impresoraEditada.empresa} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, empresa: e.target.value })} />
                <input value={impresoraEditada.usuarioResponsable} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, usuarioResponsable: e.target.value })} />
                <input value={impresoraEditada.marcaModelo} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, marcaModelo: e.target.value })} />
                <input value={impresoraEditada.serial} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, serial: e.target.value })} />
                <input value={impresoraEditada.ip} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, ip: e.target.value })} />
                <input value={impresoraEditada.estado} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, estado: e.target.value })} />
                <input value={impresoraEditada.fechaCambioToner} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, fechaCambioToner: e.target.value })} />
                <input value={impresoraEditada.observacion} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, observacion: e.target.value })} />
                <input value={impresoraEditada.fechaMantenimiento} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, fechaMantenimiento: e.target.value })} />
                <input value={impresoraEditada.propietario} onChange={(e) => setImpresoraEditada({ ...impresoraEditada, propietario: e.target.value })} />
                <button onClick={handleGuardar}>Guardar</button>
              </>
            ) : (
              <>
                <p><strong>ID:</strong> {modalImpresora.id}</p>
                <p><strong>Ciudad:</strong> {modalImpresora.ciudad}</p>
                <p><strong>Empresa:</strong> {modalImpresora.empresa}</p>
                <p><strong>Usuario Responsable:</strong> {modalImpresora.usuarioResponsable}</p>
                <p><strong>Marca / Modelo:</strong> {modalImpresora.marcaModelo}</p>
                <p><strong>Serial:</strong> {modalImpresora.serial}</p>
                <p><strong>IP:</strong> {modalImpresora.ip}</p>
                <p><strong>Estado:</strong> {modalImpresora.estado}</p>
                <p><strong>Fecha Cambio Toner:</strong> {modalImpresora.fechaCambioToner}</p>
                <p><strong>Observación:</strong> {modalImpresora.observacion}</p>
                <p><strong>Fecha Mantenimiento:</strong> {modalImpresora.fechaMantenimiento}</p>
                <p><strong>Propietario:</strong> {modalImpresora.propietario}</p>
                <button onClick={handleEditar}>Editar</button>
                <button onClick={handleEliminar}>Eliminar</button>
              </>
            )}
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Impresoras;

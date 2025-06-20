import React from "react";
import { Link } from "react-router-dom";
import { FaTools, FaUsers, FaPhone, FaKeyboard, FaPrint } from "react-icons/fa"; 
import "../styles/index.css";
import Footer from "./footer";
//import Header from "./header"; // Asegúrate de que sea Header.js y no header.js

function Servicios() {
    return (
        <>
            {/*<Header /> {/* Aquí se incluye el encabezado */}
            <div className="servicios-container">
                <h1 className="titulo">Manejo Inventarios</h1>

                <section className="services-container">
                    <Link to="/equipos" className="service-card">
                        <FaTools className="icon" />
                        <h2>Equipos</h2>
                        <p>Base de datos de equipos de computo</p>
                    </Link>
                    <Link to="/usuarios" className="service-card">
                        <FaUsers className="icon" />
                        <h2>Usuarios</h2>
                        <p>Base de datos de Usuarios</p>
                    </Link>
                    <Link to="/telefonia" className="service-card">
                        <FaPhone className="icon" />
                        <h2>Telefonia</h2>
                        <p>Relación de ip y extensión</p>
                    </Link>
                    <Link to="/perifericos" className="service-card">
                        <FaKeyboard className="icon" /> 
                        <h2>Perifericos</h2>
                        <p>Perifericos asignados</p>
                    </Link>
                    <Link to="/impresoras" className="service-card">
                        <FaPrint className="icon" />
                        <h2>Impresoras</h2>
                        <p>Datos de configuración impresoras</p>
                    </Link>
                </section>

                <Footer />
            </div>
        </>
    );
}

export default Servicios;

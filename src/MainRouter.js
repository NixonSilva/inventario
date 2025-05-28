// src/MainRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './components/servicios';
import Usuarios from './components/usuarios';
import Equipos from './components/equipos';
import Impresoras from './components/impresoras';
import Telefonia from './components/telefonia';
import Perifericos from './components/perifericos';
import Registrotelefonia from "./Formularios/telefonia";
import Registrousuarios from "./Formularios/usuarios";
import Footer from './components/footer';

const MainRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Servicios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/telefonia" element={<Telefonia />} />
        <Route path="/impresoras" element={<Impresoras />} />
        <Route path="/perifericos" element={<Perifericos />} />
        <Route path="/footer" element= {<Footer />} />
        <Route path="/Rtelefonia" element= {<Registrotelefonia />} />
        <Route path="/Formularios/usuarios" element= {<Registrousuarios />} />
      </Routes>
    </Router>
  );
};

export default MainRouter;


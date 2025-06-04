// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";

// Importación de otros componentes (tablas y gráficas)
import TablaUsuarios from "./components/usuarios";
import TablaEquipos from "./components/equipos";
import TablaTelefonia from "./components/telefonia";
import TablaPerifericos from "./components/perifericos";
import TablaImpresoras from "./components/impresoras";
import GraficasUsuarios from "./Graph/G_usuarios";
import Servicios from "./components/servicios"; // Si quieres mostrarlo al inicio

//Registros
import Registrotelefonia from "./Formularios/telefonia";
import Registrousuarios from "./Formularios/usuarios";

function App() {
  return (
    <Router>
      {/* Header se muestra en todas las páginas */}
      <Header />

      <main>
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Servicios />} />

          {/* Rutas asociadas al header */}
          <Route path="/informes" element={<GraficasUsuarios />} />
          <Route path="/contacto" element={<p>Contacto en construcción</p>} />
          <Route path="/proveedores" element={<p>Proveedores en construcción</p>} />

          {/* Otras rutas disponibles en la app */}
          <Route path="/usuarios" element={<TablaUsuarios />} />
          <Route path="/equipos" element={<TablaEquipos />} />
          <Route path="/telefonia" element={<TablaTelefonia />} />
          <Route path="/perifericos" element={<TablaPerifericos />} />
          <Route path="/impresoras" element={<TablaImpresoras />} />
          <Route path="/Rtelefonia" element= {<Registrotelefonia />} />
          <Route path="/Formularios/usuarios" element= {<Registrousuarios />} />

          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<p>Página no encontrada</p>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

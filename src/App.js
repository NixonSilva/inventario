// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import { AuthProvider } from "./AutoContext.jsx";

// Componentes
import Header from "./components/header";
//import LoginInterno from "./LoginValidate/loginInterno";

// Páginas públicas
import Servicios from "./components/servicios";

// Páginas protegidas
import TablaUsuarios from "./components/usuarios";
import TablaEquipos from "./components/equipos";
import TablaTelefonia from "./components/telefonia";
import TablaPerifericos from "./components/perifericos";
import TablaImpresoras from "./components/impresoras";
import GraficasUsuarios from "./Graph/G_usuarios";
//import UsuariosPorEmpresa from "./Graph/UsuariosPorEmpresa";

// Formularios protegidos
import Registrotelefonia from "./Formularios/telefonia";
import Registrousuarios from "./Formularios/usuarios";
import Registroequipos from "./Formularios/RegistroEquipos";
import Registroperifericos from "./Formularios/RegistroPerifericos";
import Registroimpresoras from "./Formularios/Registroimpresoras";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <main>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Servicios />} />
            {/*<Route path="/login-navemar" element={<LoginInterno />} />*/}

            {/* Rutas protegidas */}
            {/*<Route element={<ProtectedRouteInternal />}>*/}
              <Route path="/informes" element={<GraficasUsuarios />} />
              <Route path="/contacto" element={<p>Contacto en construcción</p>} />
              <Route path="/proveedores" element={<p>Proveedores en construcción</p>} />

              <Route path="/usuarios" element={<TablaUsuarios />} />
              <Route path="/equipos" element={<TablaEquipos />} />
              <Route path="/telefonia" element={<TablaTelefonia />} />
              <Route path="/perifericos" element={<TablaPerifericos />} />
              <Route path="/impresoras" element={<TablaImpresoras />} />
              <Route path="/Rtelefonia" element={<Registrotelefonia />} />
              <Route path="/Rusuarios" element={<Registrousuarios />} />
              <Route path="/Requipos" element={<Registroequipos />} />
              <Route path="/Rperifericos" element={<Registroperifericos />} />
              <Route path="/Rimpresoras" element={<Registroimpresoras />} />
            {/*</Route>*/}

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<p>Página no encontrada</p>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;

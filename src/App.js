// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
// Auth
import { AuthProvider, useAuth } from "./AutoContext.jsx";

// Componentes
import Header from "./components/header";
//import LoginInterno from "./LoginValidate/loginInterno";


import Servicios from "./components/servicios";
import TablaUsuarios from "./components/usuarios";
import TablaEquipos from "./components/equipos";
import TablaTelefonia from "./components/telefonia";
import TablaPerifericos from "./components/perifericos";
import TablaImpresoras from "./components/impresoras";
import GraficasUsuarios from "./Graph/G_usuarios";
//import UsuariosPorEmpresa from "./Graph/UsuariosPorEmpresa";

// Formularios protegidos
import Registrotelefonia from "./Formularios/RegistroTelefonia.jsx";
import Registrousuarios from "./Formularios/RegistroUsuarios.jsx";
import Registroequipos from "./Formularios/RegistroEquipos";
import Registroperifericos from "./Formularios/RegistroPerifericos";
import Registroimpresoras from "./Formularios/Registroimpresoras";
import LoginInventario from "./LoginValidate/loginInterno.jsx";
//Modificar Datos
import EditarUsuario from "./Modificar/EditarUsuario.jsx";

function App() {
  return (
      <Router>
        <AuthProvider>
         <Header />

          <main>
            <Routes>
              {/* Rutas públicas */}
              {/*<Route path="/login-navemar" element={<LoginInterno />} />*/}
          <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Servicios />
                    </ProtectedRoute>
                  }
                />
              {/* Rutas protegidas */}
              {/*<Route element={<ProtectedRouteInternal />}>*/}
                <Route path="/informes" element={<GraficasUsuarios />} />
                <Route path="/contacto" element={<p>Contacto en construcción</p>} />
                <Route path="/proveedores" element={<p>Proveedores en construcción</p>} />
                <Route path="/usuarios" element={<TablaUsuarios />} />
                <Route path="/LoginInventario" element={<LoginInventario />} />
                <Route path="/equipos" element={<TablaEquipos />} />
                <Route path="/telefonia" element={<TablaTelefonia />} />
                <Route path="/perifericos" element={<TablaPerifericos />} />
                <Route path="/impresoras" element={<TablaImpresoras />} />
                <Route path="/Rtelefonia" element={<Registrotelefonia />} />
                <Route path="/Rusuarios" element={<Registrousuarios />} />
                <Route path="/Requipos" element={<Registroequipos />} />
                <Route path="/Rperifericos" element={<Registroperifericos />} />
                <Route path="/Rimpresoras" element={<Registroimpresoras />} />
                <Route path="/Modificar/EditarUsuario/:id" element={<EditarUsuario />} />
              {/*</Route>*/}

              {/* Ruta para páginas no encontradas */}
              <Route path="*" element={<p>Página no encontrada</p>} />

            </Routes>
          </main>
        </AuthProvider>
      </Router>
    
  );
}
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/LoginInventario" />;
  }
  return children;
};
 
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default App;

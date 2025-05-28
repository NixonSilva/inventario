import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TablaUsuarios from "./components/usuarios";
import TablaEquipos from "./components/equipos";
import TablaTelefonia from "./components/telefonia";
import TablaPerifericos from "./components/perifericos";
import TablaImpresoras from "./components/impresoras";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/usuarios">Usuarios</Link> | 
        <Link to="/equipos">Equipos</Link> | 
        <Link to="/telefonia">Telefonía</Link> | 
        <Link to="/perifericos">Periféricos</Link> | 
        <Link to="/impresoras">Impresoras</Link>
      </nav>

      <Routes>
        <Route path="/usuarios" element={<TablaUsuarios />} />
        <Route path="/equipos" element={<TablaEquipos />} />
        <Route path="/telefonia" element={<TablaTelefonia />} />
        <Route path="/perifericos" element={<TablaPerifericos />} />
        <Route path="/impresoras" element={<TablaImpresoras />} />
      </Routes>
    </Router>
  );
}

export default App;

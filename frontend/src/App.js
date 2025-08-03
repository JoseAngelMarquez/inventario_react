import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrestamistaPage from "./pages/PrestamistaPage";
import Materiales from "./pages/Materiales";
import Usuarios from "./pages/Usuarios";
import Prestamos from "./pages/Prestamos";
import Inicio from "./pages/Inicio";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./components/LayoutAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Ruta común para inicio, accesible por ambos roles */}
        <Route
          path="/inicio"
          element={
            <ProtectedRoute rolPermitido={["admin", "prestamista"]}>
              <Inicio />
            </ProtectedRoute>
          }
        />

        {/* Rutas exclusivas para admin con Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="admin">
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="materiales" element={<Materiales />} />
        </Route>

        {/* Rutas exclusivas para prestamista */}
        <Route
          path="/prestamista"
          element={
            <ProtectedRoute rolPermitido="prestamista">
              <PrestamistaPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

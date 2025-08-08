import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inicio from "./pages/comunes/Inicio";
import Usuarios from "./pages/admin/Usuarios";
import Materiales from "./pages/comunes/Materiales";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./Layout/LayoutAdmin";
import LayoutPrestamista from "./Layout/LayoutPrestamista";
import Prestamos from "./pages/comunes/Prestamos";
function App() {
  return (
    <Router>
      <Routes>
        {/* Login público */}
        <Route path="/" element={<Login />} />

        {/* Layout y rutas para ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="admin">
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Inicio />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="materiales" element={<Materiales />} />
        </Route>

        {/* Layout y rutas para PRESTAMISTA */}
        <Route
          path="/prestamista"
          element={
            <ProtectedRoute rolPermitido="prestamista">
              <LayoutPrestamista />
            </ProtectedRoute>
          }
        >
          <Route index element={<Inicio />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="materiales" element={<Materiales />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;

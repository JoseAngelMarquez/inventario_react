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

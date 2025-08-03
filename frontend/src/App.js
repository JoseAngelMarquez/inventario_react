import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrestamistaPage from "./pages/PrestamistaPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Materiales from "./pages/Materiales";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="admin">
              <Materiales />
            </ProtectedRoute>
          }
        />

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

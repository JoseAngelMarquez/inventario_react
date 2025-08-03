// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import PrestamistaPage from "./pages/PrestamistaPage";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="admin">
              <AdminPage />
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

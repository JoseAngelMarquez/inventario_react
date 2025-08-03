import { Link } from "react-router-dom";

function AdminPage() {
  return (
    <div>
      <h1>Panel Admin</h1>
      <Link to="/admin/solicitudPrestamo">Gestionar Materiales</Link>
      {/* otros enlaces */}
    </div>
  );
}

export default AdminPage;

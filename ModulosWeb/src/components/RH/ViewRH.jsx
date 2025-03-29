import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import "./RH.css";
import { useNavigate } from "react-router-dom";

const RecursosHumanos = () => {
  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: "Juan Luis", aPaterno: "Aguirre", aMaterno: "Hernández", puesto: "Supervisor de Producción" },
    { id: 2, nombre: "Roberto", aPaterno: "Almaraz", aMaterno: "Bautista", puesto: "Jefe de almacén" },
    { id: 3, nombre: "Jacobo", aPaterno: "Segura", aMaterno: "López", puesto: "Técnico de Mantenimiento" },
    { id: 4, nombre: "Jaqueline", aPaterno: "Ortiz", aMaterno: "Martínez", puesto: "Contador" },
    { id: 5, nombre: "Brenda Ivonne", aPaterno: "García", aMaterno: "Carlos", puesto: "Ejecutivo de ventas" },
    { id: 6, nombre: "Samuel", aPaterno: "Monroy", aMaterno: "Aburto", puesto: "Jefe de TI" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handleDelete = (id) => {
    setEmpleados(empleados.filter((e) => e.id !== id));
  };

  const filtered = empleados.filter((e) =>
    [e.nombre, e.aPaterno, e.aMaterno, e.puesto]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const emptyRows = itemsPerPage - currentItems.length;
  const rows = [...currentItems, ...Array(emptyRows).fill(null)];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <Navbar />

      <h2 className="text-center text-white titulo-empleados">
        Gestión de Empleados
      </h2>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4" style={{ gap: "20px", marginBottom: "50px" }}>
        <button className="btn btn-agregar" onClick={() => navigate("/registro-empleado")}>
          <Plus size={26} />
        </button>

        <div className="dropdowns d-flex gap-3 mb-3">
          <select className="form-select" style={{ minWidth: "180px" }}>
            <option>Sucursal</option>
            <option>Sucursal A</option>
            <option>Sucursal B</option>
          </select>
          <select className="form-select" style={{ minWidth: "180px" }}>
            <option>Departamento</option>
            <option>Ventas</option>
            <option>TI</option>
          </select>
          <select className="form-select" style={{ minWidth: "180px" }}>
            <option>Puesto</option>
            <option>Contador</option>
            <option>Jefe de TI</option>
            
          </select>
        </div>

        <div className="d-flex gap-3 align-items-center">
          <input
            type="text"
            className="form-control buscador"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "250px" }}
          />
        </div>
      </div>

      <div className="table-responsive" style={{ minHeight: "300px" }}>
        <table className="table table-hover table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
          <thead className="custom-header table-dark">
            <tr>
              <th className="col-nombre">Nombre</th>
              <th className="col-apaterno">A. Paterno</th>
              <th className="col-amaterno">A. Materno</th>
              <th className="col-puesto">Puesto</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e, index) => (
              <tr key={index} style={{ height: "50px" }}>
                <td className="align-middle">{e?.nombre || ""}</td>
                <td className="align-middle">{e?.aPaterno || ""}</td>
                <td className="align-middle col-amaterno">{e?.aMaterno || ""}</td>
                <td className="align-middle col-puesto">{e?.puesto || ""}</td>
                <td className="text-center align-middle col-acciones">
                  {e && (
                    <div className="iconos-acciones">
                      <button className="icono-accion editar-icono">
                        <PencilSquare size={22} />
                      </button>
                      <button
                        className="icono-accion eliminar-icono"
                        onClick={() => handleDelete(e.id)}
                      >
                        <Trash size={22} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default RecursosHumanos;

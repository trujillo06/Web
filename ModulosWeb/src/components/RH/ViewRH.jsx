import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import CustomAlert from "../Alertas/CustomAlert";
import { useNavigate } from "react-router-dom";
import "./RH.css";

const API_URL = import.meta.env.VITE_API_URL;

const RecursosHumanos = () => {
  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${API_URL}/empleados`);
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const confirmDeleteEmpleado = (empleado) => {
    setAlertConfig({
      type: "confirm",
      title: "¿Eliminar empleado?",
      message: `¿Estás seguro que deseas eliminar a "${empleado.nombre} ${empleado.aPaterno}"?`,
      onConfirm: () => {
        setShowAlert(false);
        setTimeout(() => deleteEmpleado(empleado.id_empleado), 300);
      },
      onCancel: () => setShowAlert(false),
    });
    setShowAlert(true);
  };

  const deleteEmpleado = async (id) => {
    try {
      const response = await fetch(`${API_URL}/empleados/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar empleado");

      await fetchEmpleados();

      setAlertConfig({
        type: "success",
        title: "Empleado eliminado",
        message: "El empleado ha sido eliminado correctamente.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertConfig({
        type: "error",
        title: "Error al eliminar",
        message: "No se pudo eliminar al empleado.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const filteredEmpleados = empleados.filter((e) =>
    [e.nombre, e.aPaterno, e.aMaterno, e.puesto]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpleados.slice(indexOfFirstItem, indexOfLastItem);
  const emptyRows = itemsPerPage - currentItems.length;
  const rows = [...currentItems, ...Array(emptyRows).fill(null)];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <Navbar />

      <h2 className="text-center text-white titulo-empleados">
        Gestión de Empleados
      </h2>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4" style={{ gap: "20px" }}>
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
              <tr key={e ? e.id_empleado : `empty-${index}`} style={{ height: "50px" }}>
                <td className="align-middle">{e?.nombre || ""}</td>
                <td className="align-middle">{e?.aPaterno || ""}</td>
                <td className="align-middle">{e?.aMaterno || ""}</td>
                <td className="align-middle">{e?.puesto || ""}</td>
                <td className="text-center align-middle col-acciones">
                  {e && (
                    <div className="iconos-acciones">
                      <button
                        className="icono-accion editar-icono"
                        onClick={() => navigate(`/editar-empleado/${e.id_empleado}`)}
                      >
                        <PencilSquare size={22} />
                      </button>
                      <button
                        className="icono-accion eliminar-icono"
                        onClick={() => confirmDeleteEmpleado(e)}
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
          {Array.from({ length: Math.ceil(filteredEmpleados.length / itemsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {showAlert && (
        <CustomAlert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
        />
      )}
    </div>
  );
};

export default RecursosHumanos;

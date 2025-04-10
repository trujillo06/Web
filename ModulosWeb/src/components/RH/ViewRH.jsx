import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import CustomAlert from "../Alertas/CustomAlert";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../../utils/sanitize";
import "./RH.css";

const API_URL = import.meta.env.VITE_MICROSERVICE_URL;

const RecursosHumanos = () => {
  const [empleados, setEmpleados] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filtroSucursal, setFiltroSucursal] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroPuesto, setFiltroPuesto] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const mostrarAlerta = (type, title, message, onConfirm, onCancel) => {
    const defaultAction = () => setShowAlert(false);

    setAlertConfig({
      type,
      title,
      message,
      onConfirm: onConfirm || defaultAction,
      onCancel: onCancel || defaultAction,
    });
    setShowAlert(true);
  };

  const cerrarAlerta = () => setShowAlert(false);

  const navigate = useNavigate();
  const [errores, setErrores] = useState({
    curp: "",
    rfc: "",
    correo: "",
    nss: "",
  });

  useEffect(() => {
    fetchEmpleados();
    fetchPuestos();
    fetchDepartamentos();
    fetchSucursales();
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

  const fetchPuestos = async () => {
    try {
      const response = await fetch(`${API_URL}/catalogos/puesto`);
      const data = await response.json();
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener puestos:", error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/catalogos/departamento`);
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  const fetchSucursales = async () => {
    try {
      const response = await fetch(`${API_URL}/catalogos/sucursal`);
      const data = await response.json();
      setSucursales(data);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
    }
  };

  const getNombrePuesto = (idPuesto) => {
    const puesto = puestos.find((p) => p.id_puesto === idPuesto);
    return puesto ? puesto.nombre : "Desconocido";
  };

  const confirmDeleteEmpleado = (empleado) => {
    mostrarAlerta(
      "confirm",
      "¿Eliminar empleado?",
      `¿Estás seguro que deseas eliminar a "${empleado.nombre} ${empleado.apellido_paterno}"?`,
      () => {
        setShowAlert(false);
        setTimeout(() => deleteEmpleado(empleado.id_empleado), 300);
      },
      () => setShowAlert(false)
    );
  };

  const deleteEmpleado = async (id) => {
    try {
      const response = await fetch(`${API_URL}/empleados/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al eliminar empleado");

      await fetchEmpleados();

      const nuevosTotal = empleados.length - 1;
      const nuevasPaginas = Math.ceil(nuevosTotal / itemsPerPage);
      if (currentPage > nuevasPaginas) {
        setCurrentPage(Math.max(nuevasPaginas, 1));
      }

      mostrarAlerta(
        "success",
        "Empleado eliminado",
        "El empleado ha sido eliminado correctamente.",
        () => setShowAlert(false),
        () => setShowAlert(false)
      );
    } catch (error) {
      console.error(error);
      mostrarAlerta(
        "error",
        "Error al eliminar",
        "No se pudo eliminar al empleado.",
        () => setShowAlert(false),
        () => setShowAlert(false)
      );
    }
  };

  const puestosFiltrados = filtroDepartamento
    ? puestos.filter((p) => p.departamento === parseInt(filtroDepartamento))
    : puestos;

  const empleadosFiltrados = empleados.filter((e) => {
    const nombreCompleto =
      `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(searchTerm.toLowerCase());
    const coincideSucursal = filtroSucursal
      ? e.sucursal === parseInt(filtroSucursal)
      : true;
    const coincideDepartamento = filtroDepartamento
      ? puestos.find((p) => p.id_puesto === e.puesto)?.departamento ===
        parseInt(filtroDepartamento)
      : true;
    const coincidePuesto = filtroPuesto
      ? e.puesto === parseInt(filtroPuesto)
      : true;

    return (
      coincideBusqueda &&
      coincideSucursal &&
      coincideDepartamento &&
      coincidePuesto
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = empleadosFiltrados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const rows = [...currentItems];
  for (let i = 0; i < itemsPerPage - currentItems.length; i++) {
    rows.push(null);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <Navbar />

      <h2 className="text-center text-white titulo-empleados">
        Gestión de Empleados
      </h2>

      <div
        className="d-flex flex-wrap justify-content-between align-items-center mb-4"
        style={{ gap: "20px" }}
      >
        <button
          className="btn btn-agregar"
          onClick={() => navigate("/registro-empleado")}
        >
          <Plus size={26} />
        </button>

        <div className="dropdowns d-flex gap-3 mb-3">
          <select
            className="form-select"
            value={filtroSucursal}
            onChange={(e) => setFiltroSucursal(e.target.value)}
            style={{ minWidth: "180px" }}
          >
            <option value="">Sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id_sucursal} value={s.id_sucursal}>
                {s.nombre}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={filtroDepartamento}
            onChange={(e) => {
              setFiltroDepartamento(e.target.value);
              setFiltroPuesto("");
            }}
            style={{ minWidth: "180px" }}
          >
            <option value="">Departamento</option>
            {departamentos.map((d) => (
              <option key={d.id_departamento} value={d.id_departamento}>
                {d.nombre}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={filtroPuesto}
            onChange={(e) => setFiltroPuesto(e.target.value)}
            style={{ minWidth: "180px" }}
          >
            <option value="">Puesto</option>
            {puestosFiltrados.map((p) => (
              <option key={p.id_puesto} value={p.id_puesto}>
                {p.nombre}
              </option>
            ))}
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
        <table
          className="table table-hover table-bordered"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
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
            {empleadosFiltrados.length === 0
              ? Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={`empty-${index}`} style={{ height: "50px" }}>
                    {index === 0 ? (
                      <td
                        colSpan="5"
                        className="text-center text-muted align-middle"
                      >
                        No se encontraron empleados.
                      </td>
                    ) : (
                      <td colSpan="5" />
                    )}
                  </tr>
                ))
              : rows.map((e, index) => (
                  <tr
                    key={e ? e.id_empleado : `empty-${index}`}
                    style={{ height: "50px" }}
                  >
                    <td className="align-middle col-nombre">
                      {e?.nombre ? sanitizeInput(e.nombre) : ""}
                    </td>
                    <td className="align-middle col-apaterno">
                      {e?.apellido_paterno
                        ? sanitizeInput(e.apellido_paterno)
                        : ""}
                    </td>
                    <td className="align-middle col-amaterno">
                      {e?.apellido_materno
                        ? sanitizeInput(e.apellido_materno)
                        : ""}
                    </td>
                    <td className="align-middle col-puesto">
                      {e ? getNombrePuesto(e.puesto) : ""}
                    </td>
                    <td className="text-center align-middle col-acciones">
                      {e && (
                        <div className="iconos-acciones">
                          <button
                            className="icono-accion editar-icono"
                            onClick={() =>
                              navigate(`/editar-empleado/${e.id_empleado}`)
                            }
                          >
                            <PencilSquare size={24} />
                          </button>
                          <button
                            className="icono-accion eliminar-icono"
                            onClick={() => confirmDeleteEmpleado(e)}
                          >
                            <Trash size={24} />
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
          {empleadosFiltrados.length > 0 ? (
            Array.from(
              { length: Math.ceil(empleadosFiltrados.length / itemsPerPage) },
              (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button onClick={() => paginate(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              )
            )
          ) : (
            <li className="page-item disabled">
              <span className="page-link">1</span>
            </li>
          )}
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

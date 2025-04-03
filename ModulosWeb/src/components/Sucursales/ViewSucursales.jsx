import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import CustomAlert from "../Alertas/CustomAlert";
import "./Sucursal.css";

const API_URL = import.meta.env.VITE_API_URL_SUC;

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [newSucursal, setNewSucursal] = useState({
    nombre: "",
    direccion: "",
    telefono_Contacto: "",
    nombre_Encargado: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editSucursal, setEditSucursal] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    fetchSucursales();
  }, []);

  const fetchSucursales = async () => {
    try {
      const response = await fetch(`${API_URL}`);
      const data = await response.json();
      setSucursales(data);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
    }
  };

  const handleAddSucursal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSucursal),
      });

      if (!response.ok) throw new Error("Error al agregar sucursal");

      await fetchSucursales();
      closeAddModal();
      setTimeout(() => {
        setAlertConfig({
          type: "success",
          title: "Sucursal agregada",
          message: "La sucursal se agregó correctamente.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
      }, 300);
    } catch (error) {
      console.error(error);
      closeAddModal();
      setAlertConfig({
        type: "error",
        title: "Error al agregar",
        message: "No se pudo agregar la sucursal. Intenta nuevamente.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const handleEditSucursal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${editSucursal.id_Sucursal}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSucursal),
      });

      if (!response.ok) throw new Error("Error al editar sucursal");

      await fetchSucursales();
      setShowEditModal(false);

      setTimeout(() => {
        setAlertConfig({
          type: "success",
          title: "Sucursal actualizada",
          message: "Los datos se actualizaron correctamente.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
      }, 300);
    } catch (error) {
      console.error(error);
      setShowEditModal(false);
      setAlertConfig({
        type: "error",
        title: "Error al editar",
        message: "No se pudieron guardar los cambios.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const confirmDeleteSucursal = (sucursal) => {
    setAlertConfig({
      type: "confirm",
      title: "¿Eliminar sucursal?",
      message: `¿Estás seguro que deseas eliminar "${sucursal.nombre}"?`,
      onConfirm: () => {
        setShowAlert(false);
        setTimeout(() => deleteSucursal(sucursal.id_Sucursal), 300);
      },
      onCancel: () => setShowAlert(false),
    });
    setShowAlert(true);
  };

  const deleteSucursal = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar sucursal");

      await fetchSucursales();

      setAlertConfig({
        type: "success",
        title: "Sucursal eliminada",
        message: "La sucursal ha sido eliminada correctamente.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeAddModal = () => {
    setShowModal(false);
    setNewSucursal({
      nombre: "",
      direccion: "",
      telefono_Contacto: "",
      nombre_Encargado: "",
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const filteredSucursales = sucursales.filter((sucursal) =>
    [sucursal.nombre, sucursal.direccion, sucursal.telefono_Contacto, sucursal.nombre_Encargado]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSucursales.slice(indexOfFirstItem, indexOfLastItem);
  const emptyRows = itemsPerPage - currentItems.length;
  const rows = [...currentItems, ...Array(emptyRows).fill(null)];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <Navbar />
      <h2 className="text-center text-white" style={{ marginTop: "100px", marginBottom: "30px" }}>
        Gestión de Sucursales
      </h2>

      <div className="d-flex justify-content-between align-items-center mb-4" style={{ gap: "20px" }}>
        <button className="btn btn-agregar" onClick={() => setShowModal(true)}>
          <Plus size={28} />
        </button>
        <input
          type="text"
          className="form-control buscador"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive" style={{ minHeight: "300px", overflowY: "auto" }}>
        <table className="table table-hover" style={{ tableLayout: "fixed", width: "100%" }}>
          <thead className="custom-header table-dark">
            <tr>
              <th className="col-nombre">Nombre</th>
              <th className="col-direccion">Dirección</th>
              <th className="col-telefono">Teléfono</th>
              <th className="col-encargado">Encargado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "white" }}>
            {rows.map((sucursal, index) => (
              <tr key={sucursal ? sucursal.id_Sucursal : `empty-${index}`}>
                <td className="align-middle col-nombre">{sucursal?.nombre || ""}</td>
                <td className="align-middle col-direccion">{sucursal?.direccion || ""}</td>
                <td className="align-middle col-telefono">{sucursal?.telefono_Contacto || ""}</td>
                <td className="align-middle col-encargado">{sucursal?.nombre_Encargado || ""}</td>
                <td className="text-center align-middle">
                  {sucursal && (
                    <div className="iconos-acciones">
                      <button className="icono-accion editar-icono" onClick={() => {
                        setEditSucursal(sucursal);
                        setShowEditModal(true);
                      }}>
                        <PencilSquare size={26} />
                      </button>
                      <button className="icono-accion eliminar-icono" onClick={() => confirmDeleteSucursal(sucursal)}>
                        <Trash size={26} />
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
          {Array.from({ length: Math.ceil(filteredSucursales.length / itemsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* MODALES */}
      {showModal && (
        <SucursalModal
          title="Agregar Sucursal"
          sucursal={newSucursal}
          setSucursal={setNewSucursal}
          onClose={closeAddModal}
          onSubmit={handleAddSucursal}
        />
      )}

      {showEditModal && (
        <SucursalModal
          title="Editar Sucursal"
          sucursal={editSucursal}
          setSucursal={setEditSucursal}
          onClose={closeEditModal}
          onSubmit={handleEditSucursal}
        />
      )}

      {(showModal || showEditModal) && <div className="modal-backdrop fade show" />}

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

const SucursalModal = ({ title, sucursal, setSucursal, onClose, onSubmit }) => (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <form className="modal-content" onSubmit={onSubmit}>
        <div className="modal-header"style={{
                background: "rgba(0, 94, 158, 0.9)", color: "white", borderBottom: "none",
                borderRadius: "8px 8px 0 0", padding: "16px 20px"
              }}>
        <h5 className="modal-title">{title}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <input required type="text" className="form-control mb-2" placeholder="Nombre" value={sucursal?.nombre || ""} onChange={(e) => setSucursal({ ...sucursal, nombre: e.target.value })} />
          <input required type="text" className="form-control mb-2" placeholder="Dirección" value={sucursal?.direccion || ""} onChange={(e) => setSucursal({ ...sucursal, direccion: e.target.value })} />
          <input required type="text" className="form-control mb-2" placeholder="Teléfono" value={sucursal?.telefono_Contacto || ""} onChange={(e) => setSucursal({ ...sucursal, telefono_Contacto: e.target.value })} />
          <input required type="text" className="form-control mb-2" placeholder="Encargado" value={sucursal?.nombre_Encargado || ""} onChange={(e) => setSucursal({ ...sucursal, nombre_Encargado: e.target.value })} />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-cancelar" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-guardar">Guardar</button>
        </div>
      </form>
    </div>
  </div>
);

export default Sucursales;

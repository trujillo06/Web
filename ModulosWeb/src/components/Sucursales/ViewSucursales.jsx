import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import CustomAlert from "../Alertas/CustomAlert";
import "./Sucursal.css";

const API_URL = import.meta.env.VITE_API_URL;

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [newSucursal, setNewSucursal] = useState({
    nombre: "",
    direccion: "",
    telefono_contacto: "",
    nombre_encargado: "",
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
      const response = await fetch(`${API_URL}/sucursales`);
      const data = await response.json();
      setSucursales(data);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
    }
  };

  const handleAddSucursal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/sucursales`, {
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
      const response = await fetch(`${API_URL}/sucursales/${editSucursal.id_sucursal}`, {
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
        setTimeout(() => deleteSucursal(sucursal.id_sucursal), 300);
      },
      onCancel: () => setShowAlert(false),
    });
    setShowAlert(true);
  };

  const deleteSucursal = async (id) => {
    try {
      const response = await fetch(`${API_URL}/sucursales/${id}`, {
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
      telefono_contacto: "",
      nombre_encargado: "",
    });
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
  };
  

  const filteredSucursales = sucursales.filter((sucursal) =>
    [sucursal.nombre, sucursal.direccion, sucursal.telefono_contacto, sucursal.nombre_encargado]
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

      <div className="d-flex justify-content-between align-items-center" style={{ gap: "20px", marginBottom: "50px" }}>
        <button className="btn btn-agregar" onClick={() => setShowModal(true)} data-tooltip-id="tooltip-agregar">
          <Plus size={28} style={{ fontWeight: "600" }} />
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
              <tr key={sucursal ? sucursal.id_sucursal : `empty-${index}`} style={{ height: "50px" }}>
                <td className="align-middle col-nombre">{sucursal?.nombre || ""}</td>
                <td className="align-middle col-direccion">{sucursal?.direccion || ""}</td>
                <td className="align-middle col-telefono">{sucursal?.telefono_contacto || ""}</td>
                <td className="align-middle col-encargado">{sucursal?.nombre_encargado || ""}</td>
                <td className="text-center align-middle">
                  {sucursal && (
                    <div className="iconos-acciones">
                      <button className="icono-accion editar-icono" onClick={() => {
                        setEditSucursal(sucursal);
                        setShowEditModal(true);
                      }}>
                        <PencilSquare size={26} weight="bold" />
                      </button>
                      <button className="icono-accion eliminar-icono" onClick={() => confirmDeleteSucursal(sucursal)}>
                        <Trash size={26} weight="bold" />
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

      {/* MODAL AGREGAR */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={handleAddSucursal}>
              <div className="modal-header" style={{
                background: "rgba(0, 94, 158, 0.9)", color: "white", borderBottom: "none",
                borderRadius: "8px 8px 0 0", padding: "16px 20px"
              }}>
                <h5 className="modal-title">Agregar Sucursal</h5>
                <button type="button" className="btn-close" onClick={closeAddModal}></button>
              </div>
              <div className="modal-body">
                <input required type="text" className="form-control mb-2" placeholder="Nombre" value={newSucursal.nombre} onChange={(e) => setNewSucursal({ ...newSucursal, nombre: e.target.value })} />
                <input required type="text" className="form-control mb-2" placeholder="Dirección" value={newSucursal.direccion} onChange={(e) => setNewSucursal({ ...newSucursal, direccion: e.target.value })} />
                <input required type="text" className="form-control mb-2" placeholder="Teléfono" value={newSucursal.telefono_contacto} onChange={(e) => setNewSucursal({ ...newSucursal, telefono_contacto: e.target.value })} />
                <input required type="text" className="form-control mb-2" placeholder="Encargado" value={newSucursal.nombre_encargado} onChange={(e) => setNewSucursal({ ...newSucursal, nombre_encargado: e.target.value })} />
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-cancelar" onClick={closeAddModal}>Cancelar</button>
                <button type="submit" className="btn btn-guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={handleEditSucursal}>
              <div className="modal-header" style={{
                background: "rgba(0, 94, 158, 0.9)", color: "white", borderBottom: "none",
                borderRadius: "8px 8px 0 0", padding: "16px 20px"
              }}>
                <h5 className="modal-title">Editar Sucursal</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <input required type="text" className="form-control mb-2" placeholder="Nombre" value={editSucursal?.nombre || ""} onChange={(e) => setEditSucursal({ ...editSucursal, nombre: e.target.value })} />
                <input required type="text" className="form-control mb-2" placeholder="Dirección" value={editSucursal?.direccion || ""} onChange={(e) => setEditSucursal({ ...editSucursal, direccion: e.target.value })} />
                <input required type="text" className="form-control mb-2" placeholder="Teléfono" value={editSucursal?.telefono_contacto || ""} onChange={(e) => setEditSucursal({ ...editSucursal, telefono_contacto: e.target.value })} />
                <input required type="text" className="form-control mb-2" placeholder="Encargado" value={editSucursal?.nombre_encargado || ""} onChange={(e) => setEditSucursal({ ...editSucursal, nombre_encargado: e.target.value })} />
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-cancelar" onClick={closeEditModal}>Cancelar</button>
                <button type="submit" className="btn btn-guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(showModal || showEditModal) && (
        <div className="modal-backdrop fade show" />
      )}

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

export default Sucursales;

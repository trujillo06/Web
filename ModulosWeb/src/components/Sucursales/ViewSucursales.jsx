import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import { PencilSquare, Trash, Plus } from "react-bootstrap-icons";
import CustomAlert from "../Alertas/CustomAlert"; 
import { sanitizeInput } from "../../utils/sanitize";
import "./Sucursal.css";

const API_URL = import.meta.env.VITE_API_URL_SUC;

const validarSucursal = (sucursal) => {
  const errores = {};

  if (!sucursal.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio.";
  } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,50}$/.test(sucursal.nombre.trim())) {
    errores.nombre = "Nombre inválido (solo letras y espacios, 3-50 caracteres).";
  }

  if (!sucursal.direccion.trim()) {
    errores.direccion = "La dirección es obligatoria.";
  } else if (sucursal.direccion.trim().length < 5 || sucursal.direccion.trim().length > 100) {
    errores.direccion = "La dirección debe tener entre 5 y 100 caracteres.";
  }

  if (!sucursal.telefono_Contacto.trim()) {
    errores.telefono_Contacto = "El teléfono es obligatorio.";
  } else if (!/^\d{10}$/.test(sucursal.telefono_Contacto.trim())) {
    errores.telefono_Contacto = "El teléfono debe tener 10 dígitos numéricos.";
  }

  if (!sucursal.nombre_Encargado.trim()) {
    errores.nombre_Encargado = "El nombre del encargado es obligatorio.";
  } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,50}$/.test(sucursal.nombre_Encargado.trim())) {
    errores.nombre_Encargado = "Nombre del encargado inválido.";
  }

  return errores;
};

const SucursalModal = ({ title, sucursal, setSucursal, onClose, onSubmit }) => {
  const [errores, setErrores] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validaciones = validarSucursal(sucursal);
    if (Object.keys(validaciones).length > 0) {
      setErrores(validaciones);
    } else {
      setErrores({});
      onSubmit(e);
    }
  };

  const handleChange = (campo, valor) => {
    setSucursal({ ...sucursal, [campo]: valor });
    setErrores({ ...errores, [campo]: "" });
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div
            className="modal-header"
            style={{
              background: "rgba(0, 94, 158, 0.9)",
              color: "white",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              padding: "16px 20px",
            }}
          >
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className={`form-control mb-2 ${errores.nombre ? "is-invalid" : ""}`}
              placeholder="Nombre"
              value={sucursal?.nombre || ""}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
            {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}

            <input
              type="text"
              className={`form-control mb-2 ${errores.direccion ? "is-invalid" : ""}`}
              placeholder="Dirección"
              value={sucursal?.direccion || ""}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
            {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}

            <input
              type="text"
              className={`form-control mb-2 ${errores.telefono_Contacto ? "is-invalid" : ""}`}
              placeholder="Teléfono"
              value={sucursal?.telefono_Contacto || ""}
              onChange={(e) => handleChange("telefono_Contacto", e.target.value)}
            />
            {errores.telefono_Contacto && <div className="invalid-feedback">{errores.telefono_Contacto}</div>}

            <input
              type="text"
              className={`form-control mb-2 ${errores.nombre_Encargado ? "is-invalid" : ""}`}
              placeholder="Encargado"
              value={sucursal?.nombre_Encargado || ""}
              onChange={(e) => handleChange("nombre_Encargado", e.target.value)}
            />
            {errores.nombre_Encargado && <div className="invalid-feedback">{errores.nombre_Encargado}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-guardar">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sucursales;

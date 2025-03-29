import React, { useState } from "react";
import "./RH.css";
import Navbar from "../Navbar/Navbar";

const FormularioEmpleado = () => {
  const [activeTab, setActiveTab] = useState("personales");

  return (
    <div>
      <Navbar />
      <div className="registro-container">
        <h3 className="titulo">Registro de Nuevos Empleados</h3>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "personales" ? "active" : ""}`}
            onClick={() => setActiveTab("personales")}
          >
            Datos Personales
          </button>
          <button
            className={`tab ${activeTab === "laborales" ? "active" : ""}`}
            onClick={() => setActiveTab("laborales")}
          >
            Datos Laborales
          </button>
          <button
            className={`tab ${activeTab === "documentacion" ? "active" : ""}`}
            onClick={() => setActiveTab("documentacion")}
          >
            Documentación
          </button>
        </div>

        <div className="form-content">
          {activeTab === "personales" && (
            <div className="tab-panel">
              <div className="left">
                <input type="text" className="form-control mb-2" placeholder="Nombre(s)" />
                <input type="text" className="form-control mb-2" placeholder="Apellido Paterno" />
                <input type="text" className="form-control mb-2" placeholder="Apellido Materno" />
                <input type="date" className="form-control mb-2" placeholder="Fecha de Nacimiento" />

                <div className="mb-2 d-flex align-items-center gap-3">
                  <label>Sexo:</label>
                  <label><input type="radio" name="sexo" className="me-1" /> Masculino</label>
                  <label><input type="radio" name="sexo" className="me-1" /> Femenino</label>
                </div>

                <select className="form-select mb-2">
                  <option>Estado Civil</option>
                  <option>Soltero</option>
                  <option>Casado</option>
                </select>
              </div>

              <div className="right">
                <input type="text" className="form-control mb-2" placeholder="Dirección" />
                <input type="text" className="form-control mb-2" placeholder="Teléfono" />
                <input type="text" className="form-control mb-2" placeholder="CURP" />
                <input type="email" className="form-control mb-2" placeholder="Correo" />
                <input type="text" className="form-control mb-2" placeholder="RFC" />
                <input type="text" className="form-control mb-2" placeholder="NSS" />
              </div>

              <div className="foto-empleado">
                <div className="foto-box">
                  <i className="bi bi-camera" style={{ fontSize: "2rem" }}></i>
                </div>
                <p className="text-center mt-2">Número de Empleado:</p>
                <input type="text" className="form-control text-center" disabled value="0001" />
              </div>

              <div className="botones">
                <button className="btn btn-siguiente" onClick={() => setActiveTab("laborales")}>Siguiente</button>
              </div>
            </div>
          )}

          {activeTab === "laborales" && (
            <div className="tab-panel">
              <div className="left">
                <input type="date" className="form-control mb-2" placeholder="Fecha Ingreso" />
                <input type="text" className="form-control mb-2" placeholder="Tipo de Contrato" />
                <select className="form-select mb-2"><option>Puesto</option></select>
                <select className="form-select mb-2"><option>Departamento</option></select>
                <select className="form-select mb-2"><option>Sucursal</option></select>
              </div>

              <div className="right">
                <select className="form-select mb-2"><option>Turno</option></select>
                <input type="number" className="form-control mb-2" placeholder="Salario" />
              </div>

              <div className="botones">
                <button className="btn btn-secondary" onClick={() => setActiveTab("personales")}>Regresar</button>
                <button className="btn btn-siguiente" onClick={() => setActiveTab("documentacion")}>Siguiente</button>
              </div>
            </div>
          )}

          {activeTab === "documentacion" && (
            <div className="tab-panel full">
              {[
                "Acta de Nacimiento", "CURP", "INE", "Comprobante de Domicilio",
                "Comprobante de Estudios", "Número de Seguro Social", "Constancia de situación fiscal"
              ].map((label, idx) => (
                <div className="mb-2" key={idx}>
                  <label>{label}</label>
                  <input type="file" className="form-control" />
                </div>
              ))}

              <div className="mb-2">
                <label>Contrato firmado:</label>
                <div>
                  <label className="me-3"><input type="radio" name="contrato" /> Sí</label>
                  <label><input type="radio" name="contrato" /> No</label>
                </div>
              </div>

              <div className="mb-3">
                <label>Contrato</label>
                <input type="file" className="form-control" />
              </div>

              <div className="botones">
                <button className="btn btn-secondary" onClick={() => setActiveTab("laborales")}>Regresar</button>
                <button className="btn btn-success">Guardar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioEmpleado;

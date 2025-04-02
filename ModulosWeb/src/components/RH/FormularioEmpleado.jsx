import React, { useState } from "react";
import "./Form.css";
import Navbar from "../Navbar/Navbar";

const FormularioEmpleado = () => {
  const [activeTab, setActiveTab] = useState("personales");

  return (
    <div>
      <Navbar />
      <div className="registro-container">
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
                <label>
                  <span>Nombre(s):</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>Apellido Paterno:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>Apellido Materno:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>Fecha de Nacimiento:</span>
                  <input type="date" className="input-rounded" />
                </label>
                <label>
                  <span>Sexo:</span>
                  <div className="radio-options">
                    <label>
                      <input
                        type="radio"
                        className="input-rounded"
                        name="sexo"
                      />{" "}
                      Masculino
                    </label>
                    <label>
                      <input
                        type="radio"
                        className="input-rounded"
                        name="sexo"
                      />{" "}
                      Femenino
                    </label>
                  </div>
                </label>

                <label>
                  <span>Estado Civil:</span>
                  <select>
                    <option>Estado Civil</option>
                    <option>Soltero</option>
                    <option>Casado</option>
                  </select>
                </label>
              </div>

              <div className="right">
                <label>
                  <span>Dirección:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>Teléfono:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>CURP:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>Correo:</span>
                  <input type="email" className="input-rounded" />
                </label>
                <label>
                  <span>RFC:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>NSS:</span>
                  <input type="text" className="input-rounded" />
                </label>
              </div>

              <div className="foto-empleado">
                <div className="foto-box">
                  <i className="bi bi-camera" style={{ fontSize: "2rem" }}></i>
                </div>
                <p className="text-center mt-2">Número de Empleado:</p>
                <input type="text" disabled value="0001" />
              </div>

              <div className="botones">
                <button
                  className="form-btn form-btn-cancelar"
                  onClick={() => (window.location.href = "/recursos-humanos")}
                >
                  Cancelar
                </button>
                <button
                  className="form-btn form-btn-siguiente"
                  onClick={() => setActiveTab("laborales")}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {activeTab === "laborales" && (
            <div className="tab-panel">
              <div className="left">
                <label>
                  <span>Fecha de Ingreso:</span>
                  <input type="date" className="input-rounded" />
                </label>
                <label>
                  <span>Tipo de Contrato:</span>
                  <input type="text" className="input-rounded" />
                </label>
                <label>
                  <span>Puesto:</span>
                  <select>
                    <option>Puesto</option>
                  </select>
                </label>
                <label>
                  <span>Departamento:</span>
                  <select>
                    <option>Departamento</option>
                  </select>
                </label>
                <label>
                  <span>Sucursal:</span>
                  <select>
                    <option>Sucursal</option>
                  </select>
                </label>
              </div>

              <div className="right">
                <label>
                  <span>Turno:</span>
                  <select>
                    <option>Turno</option>
                  </select>
                </label>
                <label>
                  <span>Salario:</span>
                  <input type="number" className="input-rounded" />
                </label>
              </div>

              <div className="botones">
                <button
                  className="form-btn form-btn-cancelar"
                  onClick={() => setActiveTab("personales")}
                >
                  Regresar
                </button>
                <button
                  className="form-btn form-btn-siguiente"
                  onClick={() => setActiveTab("documentacion")}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {activeTab === "documentacion" && (
            <div className="tab-panel full">
              <div className="documentacion-grid">
                {[
                  "Acta de Nacimiento",
                  "CURP",
                  "INE",
                  "Comprobante de Domicilio",
                  "Comprobante de Estudios",
                  "Número de Seguro Social",
                  "Constancia de situación fiscal",
                ].map((label, idx) => (
                  <div className="doc-item" key={idx}>
                    <label>{label}</label>
                    <input type="file" className="input-rounded input-file" />
                  </div>
                ))}

                <div className="doc-item">
                  <label>Contrato firmado:</label>
                  <div className="radio-group-doc">
                    <label>
                      <input
                        type="radio"
                        name="contrato"
                        className="input-rounded"
                      />{" "}
                      Sí
                    </label>
                    <label>
                      <input type="radio" name="contrato" /> No
                    </label>
                  </div>
                </div>

                <div className="doc-item">
                  <label>Contrato</label>
                  <input type="file" />
                </div>
              </div>

              <div className="botones">
                <button
                  className="form-btn form-btn-cancelar"
                  onClick={() => setActiveTab("laborales")}
                >
                  Regresar
                </button>
                <button className="form-btn form-btn-siguiente">Guardar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioEmpleado;

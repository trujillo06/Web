import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import CustomAlert from "../Alertas/CustomAlert";
import { sanitizeInput } from "../../utils/sanitize";
import "./Form.css";

const MICROSERVICE_URL = import.meta.env.VITE_MICROSERVICE_URL;

const EditEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("personales");
  const [formData, setFormData] = useState({nombre: "",apellido_paterno: "",apellido_materno: "",fecha_nacimiento: "",sexo: "",estado_civil: "",direccion: "",telefono: "",curp: "",correo: "",rfc: "",nss: "",fecha_ingreso: "",tipo_contrato: "",puesto: "",departamento: "",sucursal: "",turno: "",salario: "",});
  const [puestos, setPuestos] = useState([]);
  const [puestosFiltrados, setPuestosFiltrados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [tiposContrato, setTiposContrato] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const sexos = [
    { id_sexo: 1, descripcion: "Masculino" },
    { id_sexo: 2, descripcion: "Femenino" },
  ];

  const fetchEmpleado = async () => {
    try {
      const res = await fetch(`${MICROSERVICE_URL}/empleados/${id}`);
      const data = await res.json();
      setFormData(data);
    } catch (err) {
      console.error("Error al cargar empleado", err);
    }
  };

  const fetchCatalogos = async () => {
    const endpoints = [
      { url: "/catalogos/puesto", setter: setPuestos },
      { url: "/catalogos/departamento", setter: setDepartamentos },
      { url: "/catalogos/sucursal", setter: setSucursales },
      { url: "/catalogos/estado_civil", setter: setEstadoCivil },
      { url: "/catalogos/tipo_contrato", setter: setTiposContrato },
      { url: "/catalogos/turno", setter: setTurnos },
    ];

    for (const { url, setter } of endpoints) {
      try {
        const res = await fetch(`${MICROSERVICE_URL}${url}`);
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error("Error al cargar catálogos", err);
      }
    }
  };

  useEffect(() => {
    fetchEmpleado();
    fetchCatalogos();
  }, []);

  useEffect(() => {
    const filtrados = puestos.filter(
      (p) => p.departamento === parseInt(formData.departamento)
    );
    setPuestosFiltrados(filtrados);
  }, [formData.departamento, puestos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/recursos-humanos");
    }
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
          nombre: sanitizeInput(formData.nombre),
          apellido_paterno: sanitizeInput(formData.apellido_paterno),
          apellido_materno: sanitizeInput(formData.apellido_materno),
          direccion: sanitizeInput(formData.direccion),
          telefono: sanitizeInput(formData.telefono),
          curp: sanitizeInput(formData.curp),
          correo: sanitizeInput(formData.correo),
          rfc: sanitizeInput(formData.rfc),
          nss: sanitizeInput(formData.nss),
          sexo: parseInt(formData.sexo),
          estado_civil: parseInt(formData.estado_civil),
          tipo_contrato: parseInt(formData.tipo_contrato),
          puesto: parseInt(formData.puesto),
          departamento: parseInt(formData.departamento),
          sucursal: parseInt(formData.sucursal),
          turno: parseInt(formData.turno),
          salario: parseFloat(formData.salario),
        };
        

      const res = await fetch(`${MICROSERVICE_URL}/empleados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      setModalType("success");
      setModalTitle("Éxito");
      setModalMessage("Empleado actualizado correctamente");
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("No se pudo actualizar el empleado");
      setShowModal(true);
    } finally {
    setLoading(false);
  }
  };

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
        </div>

        <div className="form-content">
          {activeTab === "personales" && (
            <div className="tab-panel">
              <div className="left">
                <label>
                  <span>Nombre:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Apellido Paterno:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Apellido Materno:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Fecha de Nacimiento:</span>
                  <input
                    type="date"
                    className="input-rounded"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Sexo:</span>
                  <div className="radio-options">
                    {sexos.map((item) => (
                      <label key={item.id_sexo}>
                        <input
                          type="radio"
                          name="sexo"
                          value={item.id_sexo}
                          checked={formData.sexo === item.id_sexo}
                          onChange={handleChange}
                        />
                        {item.descripcion}
                      </label>
                    ))}
                  </div>
                </label>
                <label>
                  <span>Estado Civil:</span>
                  <select
                    name="estado_civil"
                    className="input-rounded"
                    value={formData.estado_civil}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    {estadoCivil.map((e) => (
                      <option key={e.id_estado_civil} value={e.id_estado_civil}>
                        {e.descripcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="right">
                <label>
                  <span>Dirección:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Teléfono:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>CURP:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="curp"
                    value={formData.curp}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Correo:</span>
                  <input
                    type="email"
                    className="input-rounded"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>RFC:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>NSS:</span>
                  <input
                    type="text"
                    className="input-rounded"
                    name="nss"
                    value={formData.nss}
                    onChange={handleChange}
                  />
                </label>
                <div className="botones">
                  <button
                    className="form-btn form-btn-cancelar"
                    onClick={() => navigate("/recursos-humanos")}
                  >
                    Cancelar
                  </button>
                  <button
                    className="form-btn form-btn-siguiente"
                    onClick={() => setActiveTab("laborales")}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "laborales" && (
            <div className="tab-panel">
              <div className="left">
                <label>
                  <span>Fecha de Ingreso:</span>
                  <input
                    type="date"
                    className="input-rounded"
                    name="fecha_ingreso"
                    value={formData.fecha_ingreso}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Tipo de Contrato:</span>
                  <select
                    name="tipo_contrato"
                    className="input-rounded"
                    value={formData.tipo_contrato}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    {tiposContrato.map((tc) => (
                      <option
                        key={tc.id_tipo_contrato}
                        value={tc.id_tipo_contrato}
                      >
                        {tc.descripcion}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Departamento:</span>
                  <select
                    name="departamento"
                    className="input-rounded"
                    value={formData.departamento}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    {departamentos.map((dep) => (
                      <option
                        key={dep.id_departamento}
                        value={dep.id_departamento}
                      >
                        {dep.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Puesto:</span>
                  <select
                    name="puesto"
                    className="input-rounded"
                    value={formData.puesto}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    {puestosFiltrados.map((p) => (
                      <option key={p.id_puesto} value={p.id_puesto}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Sucursal:</span>
                  <select
                    name="sucursal"
                    className="input-rounded"
                    value={formData.sucursal}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    {sucursales.map((s) => (
                      <option key={s.id_sucursal} value={s.id_sucursal}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="right">
                <label>
                  <span>Turno:</span>
                  <select
                    name="turno"
                    className="input-rounded"
                    value={formData.turno}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    {turnos.map((t) => (
                      <option key={t.id_turno} value={t.id_turno}>
                        {t.descripcion}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Salario:</span>
                  <input
                    type="number"
                    className="input-rounded"
                    name="salario"
                    value={formData.salario}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="botones">
                <button
                  className="form-btn form-btn-cancelar"
                  onClick={() => navigate("/recursos-humanos")}
                >
                  Cancelar
                </button>
                <button
                  className="form-btn form-btn-siguiente"
                  onClick={handleGuardar}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <CustomAlert
          type={modalType}
          title={modalTitle}
          message={modalMessage}
          onConfirm={closeModal}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EditEmpleado;

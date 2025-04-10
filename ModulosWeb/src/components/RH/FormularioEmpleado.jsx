import React, { useState, useEffect } from "react";
import "./Form.css";
import Navbar from "../Navbar/Navbar";
import CustomAlert from "../Alertas/CustomAlert";
import { Camera } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../../utils/sanitize";

const MICROSERVICE_URL = import.meta.env.VITE_MICROSERVICE_URL;

const FormularioEmpleado = () => {
  const [activeTab, setActiveTab] = useState("personales");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    fecha_nacimiento: "",
    sexo: "",
    estado_civil: "",
    direccion: "",
    telefono: "",
    curp: "",
    correo: "",
    rfc: "",
    nss: "",
    foto: "",
    fecha_ingreso: "",
    tipo_contrato: "",
    puesto: "",
    departamento: "",
    sucursal: "",
    turno: "",
    salario: "",
    usuario: 1,
  });
  const [puestos, setPuestos] = useState([]);
  const [puestosFiltrados, setPuestosFiltrados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const sexos = [
    { id_sexo: 1, descripcion: "Masculino" },
    { id_sexo: 2, descripcion: "Femenino" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [estadoCivil, setEstadoCivil] = useState([]);
  const [tiposContrato, setTiposContrato] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [previewFoto, setPreviewFoto] = useState("");
  const formRef = React.useRef(null);
  const [errores, setErrores] = useState({
    curp: "",
    rfc: "",
    correo: "",
    nss: "",
    telefono: "",
  });

  const [errorArchivo, setErrorArchivo] = useState("");

  const inputFotoRef = React.useRef(null);

  const [empleados, setEmpleados] = useState([]);
  const hayErrores = Object.values(errores).some((msg) => msg !== "");
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const navigate = useNavigate();

  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${MICROSERVICE_URL}/empleados`);
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
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
          const res = await fetch(MICROSERVICE_URL + url);
          const data = await res.json();
          setter(data);
        } catch (err) {
          console.error(` Error al cargar :`, err);
        }
      }
    };
    fetchCatalogos();
  }, []);

  useEffect(() => {
    if (formData.departamento) {
      const filtrados = puestos.filter(
        (puesto) => puesto.departamento === parseInt(formData.departamento)
      );
      setPuestosFiltrados(filtrados);
    } else {
      setPuestosFiltrados([]);
    }
  }, [formData.departamento, puestos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (["curp", "rfc", "correo", "nss", "telefono", "correo"].includes(name)) {
      const duplicado = empleados.some((emp) => emp[name] === value);
      setErrores((prev) => ({
        ...prev,
        [name]: duplicado
          ? `Este ${name.toUpperCase()} ya está registrado.`
          : "",
      }));
    }
  };

  // const handleFotoClick = () => {
  //   document.getElementById("input-foto-empleado").click();
  // };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/recursos-humanos");
    }
  };

  const handleFotoClick = () => {
    inputFotoRef.current?.click();
  };

  const handleGuardar = async () => {
    try {
      const dataToSend = {
        nombre: sanitizeInput(formData.nombre),
        apellido_paterno: sanitizeInput(formData.apellido_paterno),
        apellido_materno: sanitizeInput(formData.apellido_materno),
        fecha_nacimiento: formData.fecha_nacimiento,
        sexo: parseInt(formData.sexo),
        estado_civil: parseInt(formData.estado_civil),
        direccion: sanitizeInput(formData.direccion),
        telefono: sanitizeInput(formData.telefono),
        curp: sanitizeInput(formData.curp),
        correo: sanitizeInput(formData.correo),
        rfc: sanitizeInput(formData.rfc),
        nss: sanitizeInput(formData.nss),
        foto: sanitizeInput(formData.foto),
        fecha_ingreso: formData.fecha_ingreso,
        tipo_contrato: parseInt(formData.tipo_contrato),
        puesto: parseInt(formData.puesto),
        departamento: parseInt(formData.departamento),
        sucursal: parseInt(formData.sucursal),
        turno: parseInt(formData.turno),
        salario: parseFloat(formData.salario),
        usuario: formData.usuario,
      };
      console.log(" JSON FINAL ENVIADO:", JSON.stringify(dataToSend, null, 2));
      const res = await fetch(
        import.meta.env.VITE_MICROSERVICE_URL + "/empleados",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) throw new Error("Error al guardar empleado");

      setModalType("success");
      setModalTitle("Éxito");
      setModalMessage("Empleado guardado correctamente");
      setShowModal(true);
    } catch (err) {
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("No se pudo guardar el empleado");
      setShowModal(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="registro-container">
        <form ref={formRef}>
          <div className="tabs">
            <button
              className={`tab ${activeTab === "personales" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("personales");
              }}
            >
              Datos Personales
            </button>
            <button
              className={`tab ${activeTab === "laborales" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                const form = formRef.current;
                if (activeTab === "personales" && form.checkValidity()) {
                  setActiveTab("laborales");
                } else {
                  form.reportValidity();
                }
              }}
            >
              Datos Laborales
            </button>
            <button
              className={`tab ${activeTab === "documentacion" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                const form = formRef.current;
                if (activeTab === "laborales" && form.checkValidity()) {
                  setActiveTab("documentacion");
                } else {
                  form.reportValidity();
                }
              }}
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
                            checked={formData.sexo === String(item.id_sexo)}
                            onChange={handleChange}
                            required
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
                      value={formData.estado_civil}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Estado Civil</option>
                      {estadoCivil.map((item) => (
                        <option
                          key={item.id_estado_civil}
                          value={item.id_estado_civil}
                        >
                          {item.descripcion}
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
                      required
                    />
                  </label>
                  <label className="campo-con-error">
                    <span>Teléfono:</span>
                    <input
                      type="text"
                      className="input-rounded"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                    {errores.telefono && (
                      <span className="error-text-absolute">
                        {errores.telefono}
                      </span>
                    )}
                  </label>
                  <label className="campo-con-error">
                    <span>CURP:</span>
                    <input
                      type="text"
                      className="input-rounded"
                      name="curp"
                      value={formData.curp}
                      onChange={handleChange}
                      required
                      pattern="[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9]{2}"
                      title="La CURP debe tener 18 caracteres alfanuméricos válidos."
                      minLength={18}
                      maxLength={18}
                    />
                    {errores.curp && (
                      <span className="error-text-absolute">
                        {errores.curp}
                      </span>
                    )}
                  </label>
                  <label className="campo-con-error">
                    <span>Correo:</span>
                    <input
                      type="email"
                      className="input-rounded"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                    {errores.correo && (
                      <span className="error-text-absolute">
                        {errores.correo}
                      </span>
                    )}
                  </label>
                  <label className="campo-con-error">
                    <span>RFC:</span>
                    <input
                      type="text"
                      className="input-rounded"
                      name="rfc"
                      value={formData.rfc}
                      onChange={handleChange}
                      required
                      pattern="[A-Z]{4}[0-9]{6}[A-Z0-9]{3}"
                      title="El RFC debe tener 13 caracteres válidos."
                      minLength={13}
                      maxLength={13}
                    />
                    {errores.rfc && (
                      <span className="error-text-absolute">{errores.rfc}</span>
                    )}
                  </label>
                  <label className="campo-con-error">
                    <span>NSS:</span>
                    <input
                      type="text"
                      className="input-rounded"
                      name="nss"
                      value={formData.nss}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{11}"
                      title="El NSS debe tener exactamente 11 dígitos."
                      minLength={11}
                      maxLength={11}
                    />
                    {errores.nss && (
                      <span className="error-text-absolute">{errores.nss}</span>
                    )}
                  </label>
                </div>

                <div className="foto-empleado">
                  <div
                    className="foto-box"
                    onClick={handleFotoClick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleFotoClick();
                    }}
                    role="button"
                    tabIndex="0"
                    aria-label="Hacer clic para cambiar la foto del empleado"
                  >
                    {previewFoto ? (
                      <img
                        src={previewFoto}
                        alt="Foto del empleado"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Camera size={40} color="#888" />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="input-foto-empleado"
                    ref={inputFotoRef} //esto se agrego
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (!file.type.startsWith("image/")) {
                          Swal.fire(
                            "Error",
                            "El archivo seleccionado no es una imagen válida.",
                            "error"
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewFoto(reader.result);

                          //  Generar nombre único
                          const extension = file.name.split(".").pop();
                          const now = new Date();
                          const timestamp = `${now.getFullYear()}${String(
                            now.getMonth() + 1
                          ).padStart(2, "0")}${String(now.getDate()).padStart(
                            2,
                            "0"
                          )}_${String(now.getHours()).padStart(2, "0")}${String(
                            now.getMinutes()
                          ).padStart(2, "0")}${String(
                            now.getSeconds()
                          ).padStart(2, "0")}`;
                          const nombreArchivo = `empleado_${timestamp}.${extension}`;

                          setFormData((prev) => ({
                            ...prev,
                            foto: nombreArchivo,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  <p className="text-center mt-2">Foto del Empleado</p>
                </div>

                <div className="botones">
                  <button
                    className="form-btn form-btn-cancelar"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/recursos-humanos");
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="form-btn form-btn-siguiente"
                    onClick={(e) => {
                      e.preventDefault();
                      const form = formRef.current;
                      if (!formData.foto) {
                        setModalType("warning");
                        setModalTitle("Foto requerida");
                        setModalMessage(
                          "Por favor sube una foto del empleado."
                        );
                        setShowModal(true);

                        return;
                      }

                      if (form && form.checkValidity()) {
                        setActiveTab("laborales");
                      } else {
                        form.reportValidity();
                      }
                    }}
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
                    <input
                      type="date"
                      className="input-rounded"
                      name="fecha_ingreso"
                      value={formData.fecha_ingreso}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    <span>Tipo de Contrato:</span>
                    <select
                      name="tipo_contrato"
                      value={formData.tipo_contrato}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Tipo de Contrato</option>
                      {tiposContrato.map((item) => (
                        <option
                          key={item.id_tipo_contrato}
                          value={item.id_tipo_contrato}
                        >
                          {item.descripcion}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Departamento:</span>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Departamento</option>
                      {departamentos.map((item) => (
                        <option
                          key={item.id_departamento}
                          value={item.id_departamento}
                        >
                          {item.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Puesto:</span>
                    <select
                      name="puesto"
                      value={formData.puesto}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Puesto</option>
                      {puestosFiltrados.map((item) => (
                        <option key={item.id_puesto} value={item.id_puesto}>
                          {item.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Sucursal:</span>
                    <select
                      name="sucursal"
                      value={formData.sucursal}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sucursal</option>
                      {sucursales.map((item) => (
                        <option key={item.id_sucursal} value={item.id_sucursal}>
                          {item.nombre}
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
                      value={formData.turno}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Turno</option>
                      {turnos.map((item) => (
                        <option key={item.id_turno} value={item.id_turno}>
                          {item.descripcion}
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
                      required
                    />
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
                    onClick={(e) => {
                      e.preventDefault();
                      const form = formRef.current;
                      if (form && form.checkValidity()) {
                        setActiveTab("documentacion");
                      } else {
                        form.reportValidity();
                      }
                    }}
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
                      <input
                        type="file"
                        className="input-rounded input-file"
                        required
                        onChange={(e) => {
                          const archivo = e.target.files[0];
                          const tiposPermitidos = [
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          ];

                          if (
                            archivo &&
                            !tiposPermitidos.includes(archivo.type)
                          ) {
                            setErrorArchivo(
                              "Solo se permiten archivos PDF o Word."
                            );
                            e.target.value = "";
                          } else {
                            setErrorArchivo("");
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="botones">
                  <button
                    className="form-btn form-btn-cancelar"
                    onClick={() => setActiveTab("laborales")}
                  >
                    Regresar
                  </button>
                  <button
                    className="form-btn form-btn-siguiente"
                    disabled={hayErrores}
                    onClick={(e) => {
                      e.preventDefault();
                      const form = formRef.current;
                      if (form && form.checkValidity()) {
                        handleGuardar();
                      } else {
                        form.reportValidity();
                      }
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
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

export default FormularioEmpleado;

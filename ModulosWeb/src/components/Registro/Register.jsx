import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../Alertas/CustomAlert";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false); 
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/register", { name, email, password });

      setModalType("success");
      setModalTitle("¡Registro exitoso!");
      setModalMessage("Ahora puedes iniciar sesión.");
      setShowModal(true);

    } catch (err) {
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Ha ocurrido un error al registrarte.");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setPasswordError("Las contraseñas no coinciden.");
    } else {
      setPasswordError("");
    }
  };

return (
  <div className="register-container">
    <div className="register-box">
      <form onSubmit={handleSubmit}>
        <h2 className="h2-color">Registrarse</h2>
        <div className="input-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <div className="input-with-icon">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={handlePasswordChange}
              required
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <div className="input-with-icon">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              onChange={handleConfirmPasswordChange}
              required
            />
            <i
              className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>
          <p className="error-message">{passwordError || "\u00A0"}</p>
        </div>
        <button
          type="submit"
          className="register-button"
          disabled={!!passwordError || password !== confirmPassword}
        >
          Registrarse
        </button>
      </form>
      <div className="login-link">
        <p>¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a></p>
      </div>
    </div>
    {showModal && (
      <CustomAlert
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onConfirm={closeModal}
      />
    )}
  </div>
);
}

export default Register;
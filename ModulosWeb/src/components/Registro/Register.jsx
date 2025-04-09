import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../Alertas/CustomAlert";
import "./Register.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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

  const API_URL = import.meta.env.VITE_API_URL_AUTH;

  const sanitizeInput = (input) => {
    return input.replace(/[<>{}"']/g, "").replace(/script/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPassword = sanitizeInput(password.trim());

    if (sanitizedPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (sanitizedPassword !== confirmPassword.trim()) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post(`${API_URL}register`, {
        nombre: sanitizedName,
        correo: sanitizedEmail,
        password: sanitizedPassword,
        rol: 1,
      });

      setModalType("success");
      setModalTitle("¡Registro exitoso!");
      setModalMessage("Ahora puedes iniciar sesión.");
      setShowModal(true);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error al registrar:", err);

      let message = "Ha ocurrido un error al registrarte.";
      if (err.response) {
        message = err.response.data?.message || "Correo ya registrado.";
      }

      setModalType("error");
      setModalTitle("Error");
      setModalMessage(message);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/");
    }
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
        <form onSubmit={handleSubmit} autoComplete="off" spellCheck="false">
          <h2 className="h2-color">Registrarse</h2>

          <div className="input-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={50}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                minLength={6}
                maxLength={32}
                autoComplete="new-password"
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label="Mostrar u ocultar contraseña"
              ></i>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <div className="input-with-icon">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                minLength={6}
                maxLength={32}
                autoComplete="new-password"
              />
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                }`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
                aria-label="Mostrar u ocultar confirmación de contraseña"
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
          <p>
            ¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a>
          </p>
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

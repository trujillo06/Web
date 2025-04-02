import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Formulario.css";
import CustomAlert from "../Alertas/CustomAlert";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Formulario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL_AUTH;

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_URL}login`, {
        correo: email.trim(),
        password: password.trim(),
      });

      const token = res.data.token ?? res.data.access_token;

      if (!token) throw new Error("No se recibió token.");
      sessionStorage.setItem("token", token);

      setModalType("success");
      setModalTitle("Éxito");
      setModalMessage("Inicio de sesión exitoso.");
      setShowModal(true);

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Ocurrió un error al iniciar sesión.";
      if (err.response) {
        errorMessage = err.response.data?.message || "Credenciales inválidas.";
      } else if (err.request) {
        errorMessage = "No se pudo contactar al servidor.";
      }

      setModalType("error");
      setModalTitle("Error");
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container" aria-label="Formulario de inicio de sesión seguro">
      <div className="login-box">
        <h2 className="h2-color">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} autoComplete="off" spellCheck="false">
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              minLength={6}
              maxLength={50}
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={32}
                autoComplete="current-password"
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label="Mostrar u ocultar contraseña"
              ></i>
            </div>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Iniciar sesión"}
          </button>
        </form>
        <div className="register-link">
          <p>¿Aún no tienes cuenta? <a href="/Register">Regístrate aquí</a></p>
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

export default Formulario;

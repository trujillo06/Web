import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Formulario.css";
import CustomAlert from "../Alertas/CustomAlert";
import "bootstrap-icons/font/bootstrap-icons.css";

function Formulario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL_AUTH;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const isValidJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(
      token
    );

    if (token && isValidJWT) {
      sessionStorage.clear();
    }
  }, []);

  const sanitizeInput = (input) => {
    return input
      .replace(/[<>{}"']/g, "") // Elimina caracteres comunes de XSS
      .replace(/script/gi, "");
  };

  useEffect(() => {
    let timerInterval;

    if (failedAttempts >= 5) {
      setSecondsLeft(30);
      setIsSubmitting(true);

      timerInterval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setFailedAttempts(0);
            setIsSubmitting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [failedAttempts]);

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (failedAttempts >= 5) return;

    setIsSubmitting(true);

    try {
      const sanitizedEmail = sanitizeInput(email.trim());
      const sanitizedPassword = sanitizeInput(password.trim());

      const res = await axios.post(`${API_URL}login`, {
        correo: sanitizedEmail,
        password: sanitizedPassword,
      });

      const token = res.data.token ?? res.data.access_token;

      if (!token || token === "null" || token === "undefined") {
        sessionStorage.removeItem("token");
        throw new Error("Token inválido o ausente.");
      }

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("correoUsuario", sanitizedEmail);

      setModalType("success");
      setModalTitle("Éxito");
      setModalMessage("Inicio de sesión exitoso.");
      setShowModal(true);

      setEmail("");
      setPassword("");
      setFailedAttempts(0);
    } catch (err) {
      let errorMessage = "Ocurrió un error al iniciar sesión.";
      if (err.response) {
        errorMessage = err.response.data?.message || "Credenciales inválidas.";
      } else if (err.request) {
        errorMessage = "No se pudo contactar al servidor.";
      }

      sessionStorage.removeItem("token");

      setFailedAttempts((prev) => prev + 1);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="login-container"
      aria-label="Formulario de inicio de sesión seguro"
    >
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowPassword(!showPassword);
                  }
                }}
                role="button"
                aria-label="Mostrar u ocultar contraseña"
                tabIndex="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Iniciar sesión"}
          </button>

          {failedAttempts >= 5 && (
            <p
              className="error-message"
              style={{ color: "red", marginTop: "10px" }}
            >
              Demasiados intentos. Intenta de nuevo en {secondsLeft} segundos...
            </p>
          )}
        </form>

        <div className="register-link">
          <p>
            ¿Aún no tienes cuenta? <a href="/Register">Regístrate aquí</a>
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

export default Formulario;

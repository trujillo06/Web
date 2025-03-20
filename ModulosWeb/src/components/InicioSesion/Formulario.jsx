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
  const [showPassword, setShowPassword]= useState("");
  const navigate = useNavigate();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setModalType("success");
      setModalTitle("Éxito");
      setModalMessage("Inicio de sesión exitoso. Redirigiendo...");
      setShowModal(true);
      navigate("/dashboard");
    } catch (err) {
      console.error('Error al Iniciar Sesión')
      setModalType("error");
      setModalTitle("Error");
      setModalMessage(err.response?.data?.message || "Ha ocurrido un error al iniciar sesión.");
      setShowModal(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="h2-color">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
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
              type={showPassword ? "text":"password"} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}></i>
          </div>
          </div>
          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
        <div className="register-link">
          <p>Aún no tienes cuenta? <a href="/Register">Regístrate aquí</a></p>
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
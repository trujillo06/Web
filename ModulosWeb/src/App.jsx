import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Formulario from "./components/InicioSesion/Formulario";
import Register from "./components/Registro/Register";
import Sucursales from "./components/Sucursales/ViewSucursales";
import RecursosHumanos from "./components/RH/ViewRH";
import Dashboard from "./components/Dashboard/Dashboard";
import FormularioEmpleados from "./components/RH/FormularioEmpleado";
import axios from "axios";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Formulario />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sucursales" element={<Sucursales/>} />
          <Route path="/recursos-humanos" element={<RecursosHumanos />} />
          <Route path="/registro-empleado" element={<FormularioEmpleados />} />

        </Routes>
      </div>
    </Router>
  );
}


axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default App;

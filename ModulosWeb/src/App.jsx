import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Formulario from "./components/InicioSesion/Formulario";
import Register from "./components/Registro/Register";
import Sucursales from "./components/Sucursales/ViewSucursales";
import RecursosHumanos from "./components/RH/ViewRH";
import Dashboard from "./components/Dashboard/Dashboard";
import FormularioEmpleados from "./components/RH/FormularioEmpleado";
import EditEmpleado from "./components/RH/EditEmpleado";
import PrivateRoute from "./components/Auth/PrivateRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Formulario />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/sucursales"
            element={
              <PrivateRoute>
                <Sucursales />
              </PrivateRoute>
            }
          />
          <Route
            path="/recursos-humanos"
            element={
              <PrivateRoute>
                <RecursosHumanos />
              </PrivateRoute>
            }
          />
          <Route
            path="/registro-empleado"
            element={
              <PrivateRoute>
                <FormularioEmpleados />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar-empleado/:id"
            element={
              <PrivateRoute>
                <EditEmpleado />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Dashboard.css";
import sucursalImg from "../../assets/franquicia.png";
import recursosImg from "../../assets/reclutamiento.png";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Link to="/sucursales" className="dashboard-box">
          <img src={sucursalImg} alt="Sucursales" className="dashboard-img" />
          <span>Sucursales</span>
        </Link>
        <Link to="/recursos-humanos" className="dashboard-box">
          <img
            src={recursosImg}
            alt="Recursos Humanos"
            className="dashboard-img"
          />
          <span>Recursos Humanos</span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

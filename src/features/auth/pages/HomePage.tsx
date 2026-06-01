import telefono from "../../../assets/Telefono-01.png";
import { useAuthStore } from "../../../store/authStore";
import { AuthNavbar } from "../components/AuthNavbar";

export function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="dashboard-page">
      <AuthNavbar
        dashboardLinkLabel={isAuthenticated ? "Ir a vehiculos" : undefined}
        showLoginLink={!isAuthenticated}
      />

      <div className="dashboard-arc" aria-hidden="true" />

      <div className="dashboard-stage">
        <img src={telefono} alt="Monitoring Innovation" className="dashboard-phone" />

        <div className="dashboard-title">
          <h1>BIENVENIDO A</h1>
          <h2>MONITORING INNOVATION</h2>
        </div>
      </div>

      <nav className="dashboard-links" aria-label="Enlaces principales">
        <a
          href="https://monitoringinnovation.com/"
          target="_blank"
          rel="noreferrer"
        >
          MONITORINGINNOVATION
        </a>
        <a href="https://gpscontrol.co/" target="_blank" rel="noreferrer">
          GPS CONTROL
        </a>
        <a href="https://github.com/Snb979/prueba-frontend" target="_blank" rel="noreferrer">
          Link repo front
        </a>
        <a
          href="https://github.com/Snb979/prueba-backend"
          target="_blank"
          rel="noreferrer"
        >
          Link repo back
        </a>
      </nav>
    </section>
  );
}

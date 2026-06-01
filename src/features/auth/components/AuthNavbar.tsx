import { Link } from "react-router-dom";

import logo from "../../../assets/Imagologo_motion.svg";

interface AuthNavbarProps {
  dashboardLinkLabel?: string;
  showLoginLink?: boolean;
}

export function AuthNavbar({
  dashboardLinkLabel,
  showLoginLink = false,
}: AuthNavbarProps) {
  return (
    <header className="auth-navbar">
      <Link to="/home" aria-label="Ir al home" className="auth-navbar-logo-link">
        <img src={logo} alt="Motion" className="auth-navbar-logo" />
      </Link>

      {dashboardLinkLabel ? (
        <Link to="/vehicles" className="auth-navbar-login-link">
          {dashboardLinkLabel}
        </Link>
      ) : showLoginLink ? (
        <Link to="/login" className="auth-navbar-login-link">
          Iniciar sesion
        </Link>
      ) : null}
    </header>
  );
}

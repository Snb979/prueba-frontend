import { useState, type ReactNode } from "react";
import { ChevronDown, Home, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logoIcon from "../../assets/Imagologo_motion.svg";
import { LoadingScreen } from "../../shared/ui/LoadingScreen";
import { useAuthStore } from "../../store/authStore";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsLoggingOut(true);

    window.setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 1400);
  };

  return (
    <div className="app-shell">
      {isLoggingOut && (
        <LoadingScreen
          title="Cerrando sesion"
          subtitle="Guardando el cierre de tu panel"
          variant="logout"
        />
      )}

      <div className="main-content">
        <header className="navbar">
          <div className="profile-menu">
            <button
              type="button"
              className="profile-trigger"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <img src={logoIcon} alt="Motion" />
              <UserRound />
              <span>Perfil</span>
              <ChevronDown className="profile-chevron" />
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-summary">
                  <strong>{user?.username}</strong>
                  <small>{user?.role}</small>
                </div>
                <button type="button" onClick={() => navigate("/home")}>
                  <Home />
                  Ir al inicio
                </button>
                <button type="button" disabled={isLoggingOut} onClick={handleLogout}>
                  <LogOut />
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
          <div className="navbar-spacer" />
        </header>

        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CircleAlert, CircleUserRound, Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import logo from "../../../assets/Imagologo_motion.svg";
import { login } from "../api/authApi";
import { AuthNavbar } from "../components/AuthNavbar";
import { authStore, useAuthStore } from "../../../store/authStore";
import { getApiErrorMessage } from "../../../shared/utils/getApiErrorMessage";
import { LoadingScreen } from "../../../shared/ui/LoadingScreen";
import { toastStore } from "../../../shared/ui/toastStore";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login: setSession } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const expiredMessage = authStore.consumeExpiredMessage();

    if (expiredMessage) {
      toastStore.show(expiredMessage, "error");
    }
  }, []);

  if (isAuthenticated && !isEntering) {
    return <Navigate to="/vehicles" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const data = await login({ email, password });
      setIsEntering(true);
      await wait(1800);

      const state = location.state as LocationState | null;
      setSession(data.access_token, data.user);
      navigate(state?.from?.pathname ?? "/vehicles", { replace: true });
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Correo o contraseña inválidos"));
      setIsSubmitting(false);
      setIsEntering(false);
    }
  };

  return (
    <div className="login-page">
      <AuthNavbar />

      {isEntering && (
        <LoadingScreen
          title="Preparando tu panel"
          subtitle="Sincronizando vehiculos y accesos"
          variant="auth"
        />
      )}

      <section className={`login-panel${message ? " login-panel-error" : ""}`}>
        <div className="login-heading">
          <img src={logo} alt="Motion" />
          <div />
          <h1>Manager</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message && <p className="form-message">{message}</p>}

          <label>
            USUARIO
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="design@monitoringinnovation.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            CONTRASEÑA
            <span className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </span>
          </label>

          <button
            className={`login-submit${isSubmitting ? " is-submitting" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/forgot-password">
            Olvide <strong style={{ fontWeight: 900 }}>Mi</strong> contraseña
          </Link>
          <Link to="/register">Registrarse</Link>
        </div>

        <div className="login-shortcuts" aria-hidden="true">
          <span>
            <CircleAlert />
          </span>
          <span>
            <CircleUserRound />
          </span>
        </div>
      </section>
    </div>
  );
}

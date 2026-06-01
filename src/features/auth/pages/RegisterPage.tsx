import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import logo from "../../../assets/Imagologo_motion.svg";
import { getApiErrorMessage } from "../../../shared/utils/getApiErrorMessage";
import { LoadingScreen } from "../../../shared/ui/LoadingScreen";
import { toastStore } from "../../../shared/ui/toastStore";
import { useAuthStore } from "../../../store/authStore";
import { AuthNavbar } from "../components/AuthNavbar";
import { login, register } from "../api/authApi";

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login: setSession } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const passwordChecks = [
    { label: "6+ caracteres", isValid: password.length >= 6 },
    { label: "Una mayúscula", isValid: /[A-Z]/.test(password) },
    { label: "Un número", isValid: /\d/.test(password) },
  ];
  const passwordIsValid = passwordChecks.every((check) => check.isValid);

  if (isAuthenticated && !isEntering) {
    return <Navigate to="/vehicles" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!passwordIsValid) {
      setMessage("La contraseña debe cumplir con los requisitos indicados");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    setIsSubmitting(true);

    try {
      const username = `${firstName.trim()} ${lastName.trim()}`.trim();
      await register({
        username,
        email,
        password,
        role: "viewer",
      });
      const session = await login({ email, password });

      setIsEntering(true);
      await wait(1800);

      setSession(session.access_token, session.user);
      toastStore.show("Cuenta creada correctamente. Bienvenido.", "success");
      navigate("/vehicles", { replace: true });
    } catch (error) {
      setMessage(getApiErrorMessage(error, "No se pudo crear la cuenta"));
      setIsSubmitting(false);
      setIsEntering(false);
    }
  };

  return (
    <div className="register-page">
      <AuthNavbar />

      {isEntering && (
        <LoadingScreen
          title="Creando tu espacio"
          subtitle="Preparando tu primer acceso a Motion"
          variant="auth"
        />
      )}

      <section className={`register-panel${message ? " register-panel-error" : ""}`}>
        <div className="register-heading">
          <img src={logo} alt="Motion" />
          <div />
          <h1>Manager</h1>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {message && <p className="form-message">{message}</p>}

          <div className="register-name-row">
            <label>
              NOMBRE
              <input
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="NOMBRE"
                autoComplete="given-name"
                required
              />
            </label>

            <span className="register-plus" aria-hidden="true">
              +
            </span>

            <label>
              APELLIDO
              <input
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="APELLIDO"
                autoComplete="family-name"
                required
              />
            </label>
          </div>

          <label>
            CORREO
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
                placeholder="************"
                autoComplete="new-password"
                minLength={6}
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

          <div className="password-constellation" aria-label="Validación de contraseña">
            <div className="password-constellation-line" aria-hidden="true" />
            {passwordChecks.map((check) => (
              <span key={check.label} className={check.isValid ? "is-valid" : ""}>
                <i aria-hidden="true" />
                {check.label}
              </span>
            ))}
          </div>

          <label>
            CONFIRMAR CONTRASEÑA
            <span className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="************"
                autoComplete="new-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </span>
          </label>

          <p className="register-terms">
            Al hacer clic en crear cuenta, aceptas las{" "}
            <span>políticas de privacidad</span> y{" "}
            <span>términos del servicio</span>.
          </p>

          <div className="register-actions">
            <Link className="register-back-link" to="/login">
              <ArrowLeft />
              Volver
            </Link>

            <button
              className={`register-submit${isSubmitting ? " is-submitting" : ""}`}
              type="submit"
              disabled={isSubmitting}
            >
              <UserPlus />
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

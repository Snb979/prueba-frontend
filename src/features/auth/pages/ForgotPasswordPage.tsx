import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import logo from "../../../assets/Imagologo_motion.svg";
import { AuthNavbar } from "../components/AuthNavbar";
import { useAuthStore } from "../../../store/authStore";
import { toastStore } from "../../../shared/ui/toastStore";

export function ForgotPasswordPage() {
  const { isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/vehicles" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toastStore.show(
        "Si el correo existe, enviaremos instrucciones para recuperar la contraseña.",
        "info",
      );
    }, 500);
  };

  return (
    <div className="forgot-page">
      <AuthNavbar />

      <section className="forgot-panel">
        <div className="forgot-heading">
          <img src={logo} alt="Motion" />
          <div />
          <h1>Manager</h1>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <p>Digite el correo electrónico con el que se registró la cuenta:</p>

          {message && <p className="form-message">{message}</p>}

          <label>
            EMAIL
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="demo@gmail.com"
              autoComplete="email"
              required
            />
          </label>

          <button
            className={`forgot-submit${isSubmitting ? " is-submitting" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar correo"}
          </button>
        </form>

        <Link className="back-login-link" to="/login">
          <ArrowLeft />
          Volver
        </Link>
      </section>
    </div>
  );
}

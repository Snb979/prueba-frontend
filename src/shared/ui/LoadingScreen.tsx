import logo from "../../assets/Imagologo_motion.svg";

interface LoadingScreenProps {
  title: string;
  subtitle?: string;
  variant?: "auth" | "vehicles" | "logout";
}

export function LoadingScreen({
  title,
  subtitle,
  variant = "auth",
}: LoadingScreenProps) {
  return (
    <div className={`loading-screen loading-screen-${variant}`}>
      <div className="loading-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
        <img src={logo} alt="" />
      </div>

      <div className="loading-copy">
        <p>{title}</p>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}

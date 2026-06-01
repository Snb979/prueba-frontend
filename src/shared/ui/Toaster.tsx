import { toastStore, useToasts } from "./toastStore";

export function Toaster() {
  const toasts = useToasts();

  return (
    <div className="toast-region" aria-live="polite" aria-label="Notificaciones">
      {toasts.map((toast) => (
        <button
          className={`toast toast-${toast.type}`}
          key={toast.id}
          type="button"
          onClick={() => toastStore.dismiss(toast.id)}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}

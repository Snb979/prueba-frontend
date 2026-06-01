import { useSyncExternalStore } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let toasts: ToastMessage[] = [];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setToasts(nextToasts: ToastMessage[]) {
  toasts = nextToasts;
  emitChange();
}

export const toastStore = {
  getSnapshot: () => toasts,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  show: (message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();

    setToasts([...toasts, { id, message, type }]);

    window.setTimeout(() => {
      toastStore.dismiss(id);
    }, 4200);
  },
  dismiss: (id: string) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  },
};

export function useToasts() {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );
}

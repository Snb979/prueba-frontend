import { useSyncExternalStore } from "react";

export type UserRole = "viewer" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthSession {
  token: string | null;
  user: AuthUser | null;
}

const AUTH_STORAGE_KEY = "auth_session";
const SESSION_EXPIRED_KEY = "session_expired_message";

let session: AuthSession = readSession();
const listeners = new Set<() => void>();

function readSession(): AuthSession {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null };
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function writeSession(nextSession: AuthSession) {
  session = nextSession;

  if (nextSession.token && nextSession.user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  emitChange();
}

export const authStore = {
  getSnapshot: () => session,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setSession: (token: string, user: AuthUser) => {
    writeSession({ token, user });
  },
  clearSession: () => {
    writeSession({ token: null, user: null });
  },
  expireSession: () => {
    localStorage.setItem(
      SESSION_EXPIRED_KEY,
      "Tu sesión ha expirado, por favor inicia sesión nuevamente",
    );
    writeSession({ token: null, user: null });
  },
  consumeExpiredMessage: () => {
    const message = localStorage.getItem(SESSION_EXPIRED_KEY);
    localStorage.removeItem(SESSION_EXPIRED_KEY);
    return message;
  },
};

export function useAuthStore() {
  const currentSession = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot,
  );

  return {
    ...currentSession,
    isAuthenticated: Boolean(currentSession.token),
    role: currentSession.user?.role ?? null,
    isAdmin: currentSession.user?.role === "admin",
    login: authStore.setSession,
    logout: authStore.clearSession,
  };
}

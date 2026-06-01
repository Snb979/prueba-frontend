import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore, type UserRole } from "../../store/authStore";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role } = useAuthStore();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/vehicles" replace />;
  }

  return children;
}

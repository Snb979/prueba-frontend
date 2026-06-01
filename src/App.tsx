import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import { AppLayout } from "./app/layouts/AppLayout";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { RoleRoute } from "./app/router/RoleRoute";
import { HomePage } from "./features/auth/pages/HomePage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { VehicleFormPage } from "./features/vehicles/pages/VehicleFormPage";
import { VehicleListPage } from "./features/vehicles/pages/VehicleListPage";
import { Toaster } from "./shared/ui/Toaster";
import "./App.css";

function withAppLayout(page: ReactNode) {
  return (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/vehicles" element={withAppLayout(<VehicleListPage />)} />
        <Route
          path="/vehicles/create"
          element={withAppLayout(
            <RoleRoute allowedRoles={["admin"]}>
              <VehicleFormPage />
            </RoleRoute>,
          )}
        />
        <Route
          path="/vehicles/:vehicleId/edit"
          element={withAppLayout(
            <RoleRoute allowedRoles={["admin"]}>
              <VehicleFormPage />
            </RoleRoute>,
          )}
        />
        <Route path="*" element={<Navigate to="/vehicles" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

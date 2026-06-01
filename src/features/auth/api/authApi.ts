import api from "../../../api/axios";
import { unwrapEnvelope, type ApiEnvelope } from "../../../shared/utils/apiEnvelope";
import type { AuthUser } from "../../../store/authStore";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: AuthUser["role"];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
  user: AuthUser;
}

export async function login(payload: LoginPayload) {
  const response = await api.post<ApiEnvelope<LoginResponse>>(
    "/api/auth/login",
    payload,
  );

  return unwrapEnvelope(response.data);
}

export async function getMe() {
  const response = await api.get<ApiEnvelope<AuthUser>>("/api/auth/me");

  return unwrapEnvelope(response.data);
}

export async function register(payload: RegisterPayload) {
  const response = await api.post<ApiEnvelope<AuthUser>>(
    "/api/auth/register",
    payload,
  );

  return unwrapEnvelope(response.data);
}

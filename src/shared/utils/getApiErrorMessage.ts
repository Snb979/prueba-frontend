import { isAxiosError } from "axios";

interface ValidationErrorItem {
  loc?: Array<string | number>;
  msg?: string;
}

interface ApiErrorBody {
  message?: string;
  data?: ValidationErrorItem[] | unknown;
}

const FIELD_LABELS: Record<string, string> = {
  email: "Correo",
  password: "Contraseña",
  username: "Nombre",
  role: "Rol",
};

function translateField(field: unknown) {
  if (typeof field !== "string") {
    return null;
  }

  return FIELD_LABELS[field] ?? field;
}

function translateMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("field required")) {
    return "Este campo es obligatorio";
  }

  if (
    normalized.includes("valid email") ||
    normalized.includes("email address")
  ) {
    return "Credenciales inválidas";
  }

  if (normalized.includes("at least 6")) {
    return "Debe tener al menos 6 caracteres";
  }

  if (normalized.includes("at least")) {
    return "No cumple la longitud mínima";
  }

  if (normalized.includes("at most")) {
    return "Supera la longitud máxima permitida";
  }

  if (normalized.includes("invalid email or password")) {
    return "Correo o contraseña inválidos";
  }

  if (normalized.includes("email is already registered")) {
    return "Este correo ya está registrado";
  }

  if (normalized.includes("invalid request")) {
    return "Solicitud inválida";
  }

  return message;
}

function getValidationMessage(errors: unknown) {
  if (!Array.isArray(errors)) {
    return null;
  }

  const firstError = errors[0] as ValidationErrorItem | undefined;

  if (!firstError?.msg) {
    return null;
  }

  const field = firstError.loc?.at(-1);
  const translatedMessage = translateMessage(firstError.msg);
  const translatedField = translateField(field);

  return translatedField
    ? `${translatedField}: ${translatedMessage}`
    : translatedMessage;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }

  const body = error.response?.data;
  const validationMessage = getValidationMessage(body?.data);

  return validationMessage ?? (body?.message ? translateMessage(body.message) : fallback);
}

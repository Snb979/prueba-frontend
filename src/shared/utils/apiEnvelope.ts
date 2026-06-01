export interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  meta: Record<string, unknown>;
}

export function unwrapEnvelope<T>(response: ApiEnvelope<T>): T {
  return response.data;
}

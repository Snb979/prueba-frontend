import api from "../../../api/axios";
import { unwrapEnvelope, type ApiEnvelope } from "../../../shared/utils/apiEnvelope";
import type { Vehicle, VehiclePayload } from "../model/types";

export async function getVehicles() {
  const response = await api.get<ApiEnvelope<Vehicle[]>>("/api/vehicles");

  return unwrapEnvelope(response.data);
}

export async function getVehicle(id: number) {
  const response = await api.get<ApiEnvelope<Vehicle>>(`/api/vehicles/${id}`);

  return unwrapEnvelope(response.data);
}

export async function createVehicle(payload: VehiclePayload) {
  const response = await api.post<ApiEnvelope<Vehicle>>("/api/vehicles", payload);

  return unwrapEnvelope(response.data);
}

export async function updateVehicle(id: number, payload: VehiclePayload) {
  const response = await api.put<ApiEnvelope<Vehicle>>(
    `/api/vehicles/${id}`,
    payload,
  );

  return unwrapEnvelope(response.data);
}

export async function deleteVehicle(id: number) {
  const response = await api.delete<ApiEnvelope<null>>(`/api/vehicles/${id}`);

  return unwrapEnvelope(response.data);
}

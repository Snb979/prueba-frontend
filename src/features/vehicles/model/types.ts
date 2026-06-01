export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  location: string;
  applicant: string;
  status: string;
  owner_id: number | null;
}

export interface VehiclePayload {
  brand: string;
  model: string;
  location: string;
  applicant: string;
  status: string;
}

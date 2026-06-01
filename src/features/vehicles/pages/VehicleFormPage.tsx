import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createVehicle, getVehicle, updateVehicle } from "../api/vehiclesApi";
import { VehicleForm } from "../components/VehicleForm";
import type { VehiclePayload } from "../model/types";
import { getApiErrorMessage } from "../../../shared/utils/getApiErrorMessage";
import { toastStore } from "../../../shared/ui/toastStore";

const emptyVehicle: VehiclePayload = {
  brand: "",
  model: "",
  location: "",
  applicant: "",
  status: "available",
};

export function VehicleFormPage() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const isEditing = Boolean(vehicleId);

  const [form, setForm] = useState<VehiclePayload>(emptyVehicle);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadVehicle() {
      if (!vehicleId) {
        return;
      }

      try {
        const vehicle = await getVehicle(Number(vehicleId));
        setForm({
          brand: vehicle.brand,
          model: vehicle.model,
          location: vehicle.location,
          applicant: vehicle.applicant,
          status: vehicle.status,
        });
      } catch (error) {
        setMessage(getApiErrorMessage(error, "No fue posible cargar el vehiculo"));
      }
    }

    void loadVehicle();
  }, [vehicleId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      if (isEditing && vehicleId) {
        await updateVehicle(Number(vehicleId), form);
      } else {
        await createVehicle(form);
      }

      toastStore.show(
        isEditing ? "Vehiculo actualizado correctamente" : "Vehiculo creado correctamente",
        "success",
      );
      navigate("/vehicles");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "No fue posible guardar el vehiculo"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="page-title-row">
        <div>
          <h1>{isEditing ? "Editar vehiculo" : "Crear vehiculo"}</h1>
          <p>Completa los datos operativos del vehiculo.</p>
        </div>
      </div>

      <VehicleForm
        value={form}
        isSubmitting={isSubmitting}
        errorMessage={message}
        submitLabel={isEditing ? "Guardar cambios" : "Crear vehiculo"}
        onCancel={() => navigate("/vehicles")}
        onChange={setForm}
        onSubmit={() => void handleSubmit()}
      />
    </section>
  );
}

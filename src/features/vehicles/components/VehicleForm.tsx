import type { ChangeEvent, FormEvent } from "react";

import type { VehiclePayload } from "../model/types";

interface VehicleFormProps {
  value: VehiclePayload;
  isSubmitting: boolean;
  errorMessage: string;
  submitLabel: string;
  onCancel: () => void;
  onChange: (value: VehiclePayload) => void;
  onSubmit: () => void;
}

export function VehicleForm({
  value,
  isSubmitting,
  errorMessage,
  submitLabel,
  onCancel,
  onChange,
  onSubmit,
}: VehicleFormProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      ...value,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      {errorMessage && <p className="form-message">{errorMessage}</p>}

      <label>
        Marca
        <input
          name="brand"
          value={value.brand}
          onChange={handleChange}
          placeholder="Toyota"
          required
        />
      </label>

      <label>
        Modelo
        <input
          name="model"
          value={value.model}
          onChange={handleChange}
          placeholder="Corolla 2025"
          required
        />
      </label>

      <label>
        Sucursal
        <input
          name="location"
          value={value.location}
          onChange={handleChange}
          placeholder="Bogota"
          required
        />
      </label>

      <label>
        Aspirante
        <input
          name="applicant"
          value={value.applicant}
          onChange={handleChange}
          placeholder="Nombre del aspirante"
          required
        />
      </label>

      <label>
        Estado
        <select name="status" value={value.status} onChange={handleChange}>
          <option value="available">Disponible</option>
          <option value="reserved">Reservado</option>
          <option value="delivered">Entregado</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

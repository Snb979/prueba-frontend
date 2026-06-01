import { useEffect, useState } from "react";

import cancelIcon from "../../../assets/Icon_cancelar.svg";
import confirmIcon from "../../../assets/Icon_confirmar.svg";
import createIcon from "../../../assets/Icon_crear.svg";
import editIconActive from "../../../assets/Icon_editar1.svg";
import deleteIconActive from "../../../assets/Icon_eliminar1.svg";
import carIcon from "../../../assets/Icon_vehiculo.svg";
import carIconActive from "../../../assets/Icon_vehiculo1.svg";
import locationIcon from "../../../assets/Icon_puntoubicacion.svg";
import locationIconActive from "../../../assets/Icon_puntoubicacion1.svg";
import personIcon from "../../../assets/Icon_persona.svg";
import personIconActive from "../../../assets/Icon_persona1.svg";
import logoMotion from "../../../assets/Imagologotipo_motion.svg";
import { useAuthStore } from "../../../store/authStore";
import { getApiErrorMessage } from "../../../shared/utils/getApiErrorMessage";
import { toastStore } from "../../../shared/ui/toastStore";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../api/vehiclesApi";
import type { Vehicle, VehiclePayload } from "../model/types";

type QuickCardMode = "idle" | "create" | "edit";
type RowAnimation = "created" | "updated";

const initialQuickVehicle: VehiclePayload = {
  brand: "",
  model: "Pendiente",
  location: "",
  applicant: "",
  status: "available",
};

export function VehicleListPage() {
  const { isAdmin } = useAuthStore();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickVehicle, setQuickVehicle] = useState<VehiclePayload>(initialQuickVehicle);
  const [quickMode, setQuickMode] = useState<QuickCardMode>("idle");
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [removingVehicleIds, setRemovingVehicleIds] = useState<number[]>([]);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [rowAnimations, setRowAnimations] = useState<Record<number, RowAnimation>>({});
  const isQuickCardActive = quickMode !== "idle";

  const markRowAnimation = (id: number, animation: RowAnimation) => {
    setRowAnimations((current) => ({ ...current, [id]: animation }));

    window.setTimeout(() => {
      setRowAnimations((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }, 950);
  };

  const loadVehicles = async () => {
    setIsLoading(true);

    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      toastStore.show(
        getApiErrorMessage(error, "No fue posible cargar los vehiculos"),
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadVehicles();
  }, []);

  const handleQuickChange = (field: keyof VehiclePayload, value: string) => {
    setQuickVehicle((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openCreateMode = () => {
    if (!isAdmin) {
      return;
    }

    setQuickVehicle(initialQuickVehicle);
    setEditingVehicleId(null);
    setConfirmingDeleteId(null);
    setQuickMode("create");
  };

  const openEditMode = (vehicle: Vehicle) => {
    setConfirmingDeleteId(null);
    setQuickVehicle({
      brand: vehicle.brand,
      model: vehicle.model || "Pendiente",
      location: vehicle.location,
      applicant: vehicle.applicant,
      status: vehicle.status,
    });
    setEditingVehicleId(vehicle.id);
    setQuickMode("edit");
  };

  const closeQuickMode = () => {
    setQuickVehicle(initialQuickVehicle);
    setEditingVehicleId(null);
    setQuickMode("idle");
  };

  const handleQuickSave = async () => {
    if (!quickVehicle.brand || !quickVehicle.location || !quickVehicle.applicant) {
      toastStore.show("Completa marca, sucursal y aspirante", "error");
      return;
    }

    setIsSaving(true);

    try {
      if (quickMode === "edit" && editingVehicleId) {
        const updatedVehicle = await updateVehicle(editingVehicleId, quickVehicle);
        setVehicles((current) =>
          current.map((vehicle) =>
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle,
          ),
        );
        markRowAnimation(updatedVehicle.id, "updated");
        toastStore.show("Vehiculo actualizado correctamente", "success");
      } else {
        const createdVehicle = await createVehicle(quickVehicle);
        setVehicles((current) => [createdVehicle, ...current]);
        markRowAnimation(createdVehicle.id, "created");
        toastStore.show("Vehiculo creado correctamente", "success");
      }

      closeQuickMode();
    } catch (error) {
      toastStore.show(
        getApiErrorMessage(error, "No fue posible guardar el vehiculo"),
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVehicle(id);
      setConfirmingDeleteId(null);
      setRemovingVehicleIds((current) => [...current, id]);

      window.setTimeout(() => {
        setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
        setRemovingVehicleIds((current) =>
          current.filter((vehicleId) => vehicleId !== id),
        );
      }, 430);

      toastStore.show("Vehiculo eliminado correctamente", "success");
    } catch (error) {
      toastStore.show(
        getApiErrorMessage(error, "No fue posible eliminar el vehiculo"),
        "error",
      );
    }
  };

  return (
    <section className="vehicles-page">
      <div className="vehicles-workspace">
        <form
          className={[
            "vehicle-quick-card",
            quickMode !== "idle" ? "is-expanded" : "",
            quickMode === "edit" ? "is-editing" : "",
            !isAdmin ? "is-disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onSubmit={(event) => {
            event.preventDefault();
            void handleQuickSave();
          }}
        >
          <button
            className="quick-add-button"
            type="button"
            disabled={!isAdmin}
            onClick={quickMode === "create" ? closeQuickMode : openCreateMode}
          >
            <img src={createIcon} alt="" aria-hidden="true" />
          </button>

          {!isAdmin && <p>Solo administradores pueden crear vehiculos.</p>}

          <label>
            <img src={isQuickCardActive ? carIconActive : carIcon} alt="" aria-hidden="true" />
            <input
              value={quickVehicle.brand}
              onChange={(event) => handleQuickChange("brand", event.target.value)}
              placeholder="Mazda"
              disabled={!isAdmin || quickMode === "idle"}
              required
            />
          </label>

          <label>
            <img
              src={isQuickCardActive ? locationIconActive : locationIcon}
              alt=""
              aria-hidden="true"
            />
            <input
              value={quickVehicle.location}
              onChange={(event) => handleQuickChange("location", event.target.value)}
              placeholder="Chapinero"
              disabled={!isAdmin || quickMode === "idle"}
              required
            />
          </label>

          <label>
            <img
              src={isQuickCardActive ? personIconActive : personIcon}
              alt=""
              aria-hidden="true"
            />
            <input
              value={quickVehicle.applicant}
              onChange={(event) => handleQuickChange("applicant", event.target.value)}
              placeholder="David Sandoval"
              disabled={!isAdmin || quickMode === "idle"}
              required
            />
          </label>

          {quickMode !== "idle" && (
            <div className="quick-card-actions">
              {quickMode === "edit" ? (
              <>
                <button
                  type="button"
                  className="quick-icon-action is-cancel"
                  aria-label="Cancelar edicion"
                  onClick={closeQuickMode}
                >
                  <img src={cancelIcon} alt="" aria-hidden="true" />
                </button>
                <button
                  type="submit"
                  className="quick-icon-action is-confirm"
                  aria-label="Confirmar edicion"
                  disabled={isSaving}
                >
                  <img src={confirmIcon} alt="" aria-hidden="true" />
                </button>
              </>
              ) : (
              <>
                <button type="button" className="quick-text-action is-cancel" onClick={closeQuickMode}>
                  Cancelar
                </button>
                <button type="submit" className="quick-text-action is-create" disabled={isSaving}>
                  Crear
                </button>
              </>
              )}
            </div>
          )}
        </form>

        <div className="vehicles-table">
          <div className="table-header">
            <span>Marca</span>
            <span>Sucursal</span>
            <span>Aspirante</span>
          </div>

          {isLoading &&
            Array.from({ length: 9 }).map((_, index) => (
              <article className="vehicle-row vehicle-row-skeleton" key={index}>
                <span />
                <span />
                <span />
              </article>
            ))}

          {!isLoading && vehicles.length === 0 && (
            <p className="empty-state">No hay vehiculos registrados.</p>
          )}

          {!isLoading &&
            vehicles.map((vehicle) => (
              <article
                className={[
                  "vehicle-row",
                  removingVehicleIds.includes(vehicle.id) ? "is-removing" : "",
                  rowAnimations[vehicle.id] === "created" ? "is-created" : "",
                  rowAnimations[vehicle.id] === "updated" ? "is-updated" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={vehicle.id}
              >
                <span className="vehicle-cell" title={vehicle.brand}>
                  {vehicle.brand}
                </span>
                <span className="vehicle-cell" title={vehicle.location}>
                  {vehicle.location}
                </span>
                <span className="applicant-cell">
                  <span className="vehicle-cell applicant-name" title={vehicle.applicant}>
                    {vehicle.applicant}
                  </span>

                  {isAdmin && (
                    <span
                      className={[
                        "row-actions",
                        confirmingDeleteId === vehicle.id ? "is-confirming-delete" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {confirmingDeleteId === vehicle.id ? (
                        <>
                          <button
                            type="button"
                            aria-label="Cancelar eliminacion"
                            onClick={() => setConfirmingDeleteId(null)}
                          >
                            <img src={cancelIcon} alt="" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label="Confirmar eliminacion"
                            disabled={removingVehicleIds.includes(vehicle.id)}
                            onClick={() => void handleDelete(vehicle.id)}
                          >
                            <img src={confirmIcon} alt="" aria-hidden="true" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-label="Editar vehiculo"
                            onClick={() => openEditMode(vehicle)}
                          >
                            <img src={editIconActive} alt="" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label="Eliminar vehiculo"
                            disabled={removingVehicleIds.includes(vehicle.id)}
                            onClick={() => setConfirmingDeleteId(vehicle.id)}
                          >
                            <img src={deleteIconActive} alt="" aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </span>
                  )}
                </span>
              </article>
            ))}
        </div>
      </div>

      <div className="motion-container">
        <img src={logoMotion} alt="Motion" className="motion-logo" />
      </div>
    </section>
  );
}

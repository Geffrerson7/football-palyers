import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";

export default function DeletePlayerModal({
  jugador,
  isOpen,
  onOpenChange,
  onDelete,
}) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  async function handleEliminar() {
    if (!jugador?.id || eliminando) return;

    setEliminando(true);
    setError("");

    try {
      const { error: errorEliminar } = await supabase
        .from("jugadores")
        .delete()
        .eq("id", jugador.id);

      if (errorEliminar) throw errorEliminar;

      onOpenChange(false);
      onDelete(jugador.id);

      toast.success("Jugador eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar jugador:", err);

      setError("No se pudo eliminar al jugador. Inténtalo nuevamente.");
      toast.danger("No se pudo eliminar al jugador.");
    } finally {
      setEliminando(false);
    }
  }

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!eliminando}
      isKeyboardDismissDisabled={eliminando}
      className="z-50"
    >
      <Modal.Container>
        <Modal.Dialog className="pl-surface w-full max-w-md rounded-xl border border-(--pl-line) shadow-xl" aria-label="Eliminar jugador">
          <Modal.CloseTrigger />

          <Modal.Header className="flex flex-col items-start gap-2 border-b border-(--pl-line) px-5 py-4">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-(--pl-sash)">
              Mundial 2026 · Plantel
            </span>

            <h2 className="pl-display text-3xl font-black leading-none text-(--pl-ink)">
              Eliminar jugador
            </h2>
          </Modal.Header>

          <Modal.Body className="gap-4 px-5 py-5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-(--pl-sash)/10 text-xl text-(--pl-sash)"
              >
                !
              </span>

              <div className="min-w-0">
                <p className="text-sm leading-relaxed text-(--pl-muted)">
                  ¿Estás seguro de que deseas eliminar a este jugador del
                  plantel? Esta acción no se puede deshacer.
                </p>

                {jugador && (
                  <div className="mt-4 rounded-lg border border-(--pl-line) bg-(--pl-surface) px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-(--pl-muted)">
                      Jugador seleccionado
                    </p>

                    <p className="mt-1 wrap-break-words font-bold text-(--pl-ink)">
                      {jugador.nombre}
                    </p>

                    {jugador.dorsal != null && (
                      <p className="mt-1 text-sm text-(--pl-muted)">
                        Dorsal #{jugador.dorsal}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-(--pl-sash)/40 bg-(--pl-sash)/10 px-3 py-2 text-sm text-(--pl-sash)"
              >
                {error}
              </p>
            )}
          </Modal.Body>

          <Modal.Footer className="flex flex-wrap justify-end gap-2 border-t border-(--pl-line) px-5 py-4">
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
              isDisabled={eliminando}
              className="font-semibold"
            >
              Cancelar
            </Button>

            <Button
              onPress={handleEliminar}
              isDisabled={!jugador?.id || eliminando}
              className="bg-(--pl-sash) font-bold text-white transition-opacity hover:opacity-90"
            >
              {eliminando ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

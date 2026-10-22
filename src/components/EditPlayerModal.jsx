import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  Select,
  ListBox,
  Switch,
} from "@heroui/react";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";
import { useState } from "react";

const labelClass = "text-sm font-semibold text-[var(--pl-ink)]";

export default function EditPlayerModal({
  jugador,
  isOpen,
  onOpenChange,
  onUpdated,
}) {
  const [nombre, setNombre] = useState(jugador?.nombre ?? "");
  const [posicion, setPosicion] = useState(jugador?.posicion ?? "");
  const [dorsal, setDorsal] = useState(String(jugador?.dorsal ?? ""));
  const [fechaNacimiento, setFechaNacimiento] = useState(
    jugador?.fecha_nacimiento ?? "",
  );
  const [activo, setActivo] = useState(jugador?.activo ?? true);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!jugador) return;

    const actualizado = {
      nombre: nombre.trim(),
      posicion,
      dorsal: Number(dorsal),
      fecha_nacimiento: fechaNacimiento || null,
      activo,
    };

    try {
      const { data, error } = await supabase
        .from("jugadores")
        .update(actualizado)
        .eq("id", jugador.id)
        .select()
        .single();

      if (error) throw error;

      onUpdated(data);
      onOpenChange(false);

      toast.success("Jugador actualizado correctamente", {
        description: `${data.nombre} se actualizó correctamente.`,
      });
    } catch (error) {
      console.error("Error al actualizar jugador:", error);

      toast.error("No se pudo actualizar al jugador", {
        description: "Revisa los datos e intenta nuevamente.",
      });
    }
  }

  if (!jugador) return null;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
      <Modal.Container placement="center" scroll="inside">
        <Modal.Dialog className="pl-surface h-auto max-h-[90dvh] overflow-hidden rounded-lg border border-(--pl-line) sm:max-w-md">
          <Modal.CloseTrigger />

          <div aria-hidden="true" className="h-2 w-full bg-(--pl-sash)" />

          <Modal.Header className="px-6 pt-6">
            <Modal.Heading className="pl-display text-4xl font-black leading-none">
              Editar jugador
            </Modal.Heading>

            <p className="mt-2 text-sm text-(--pl-muted)">
              Modifica los datos del jugador seleccionado.
            </p>
          </Modal.Header>

          <Form
            key={jugador.id}
            onSubmit={handleSubmit}
            className="flex flex-col"
          >
            <Modal.Body className="flex flex-col gap-5 px-6 py-5">
              <TextField
                name="nombre"
                isRequired
                className="flex w-full flex-col gap-1.5"
              >
                <Label className={labelClass}>Nombre</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  variant="primary"
                  className="w-full"
                  autoComplete="off"
                  required
                />
                <FieldError />
              </TextField>

              <Select
                name="posicion"
                value={posicion}
                onChange={setPosicion}
                isRequired
                variant="primary"
                className="flex w-full flex-col gap-1.5"
              >
                <Label className={labelClass}>Posición</Label>

                <Select.Trigger className="w-full">
                  <Select.Value placeholder="Selecciona la posición" />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="Portero" textValue="Portero">
                      Portero
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item id="Defensa" textValue="Defensa">
                      Defensa
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item id="Mediocampista" textValue="Mediocampista">
                      Mediocampista
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item id="Delantero" textValue="Delantero">
                      Delantero
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>

              <TextField
                name="dorsal"
                value={dorsal}
                isRequired
                validate={(valor) => {
                  const numero = Number(valor);
                  if (!Number.isInteger(numero) || numero < 1 || numero > 99) {
                    return "Ingresa un dorsal entre 1 y 99.";
                  }
                }}
                className="flex w-full flex-col gap-1.5"
              >
                <Label className={labelClass}>Dorsal</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={dorsal}
                  onChange={(e) => setDorsal(e.target.value)}
                  variant="primary"
                  className="w-full"
                  min={1}
                  max={99}
                />
                <FieldError />
              </TextField>

              <TextField
                name="fechaDeNacimiento"
                isRequired
                className="flex w-full flex-col gap-1.5"
              >
                <Label className={labelClass}>Fecha de nacimiento</Label>
                <Input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  variant="primary"
                  className="w-full"
                  required
                />
                <FieldError />
              </TextField>

              <Switch isSelected={activo} onChange={setActivo}>
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  Activo
                </Switch.Content>
              </Switch>
            </Modal.Body>

            <Modal.Footer className="gap-3 border-t border-(--pl-line) px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onPress={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-(--pl-sash) font-semibold text-white"
              >
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

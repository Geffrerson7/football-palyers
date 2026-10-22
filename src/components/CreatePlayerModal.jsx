import { useState } from "react";
import {
  Button,
  DateField,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  Select,
  ListBox,
} from "@heroui/react";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";

// Nombre de la columna de fecha en tu tabla "jugadores".
// Cámbialo aquí si en Supabase se llama distinto (p. ej. "fecha_nacimiento").
const COLUMNA_FECHA = "fecha_nacimiento";

const labelClass = "text-sm font-semibold text-[var(--pl-ink)]";

export default function CreatePlayerModal({ isOpen, onOpenChange, onCreated }) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);

    const nuevo = {
      nombre: String(datos.get("nombre") ?? "").trim(),
      posicion: String(datos.get("posicion") ?? "").trim(),
      dorsal: Number(datos.get("dorsal")),
      [COLUMNA_FECHA]: datos.get("fechaDeNacimiento") || null,
    };

    setGuardando(true);

    try {
      const { data, error: errorSupabase } = await supabase
        .from("jugadores")
        .insert(nuevo)
        .select()
        .single();

      if (errorSupabase) {
        console.error("Error al registrar jugador:", errorSupabase);

        toast.error("No se pudo registrar al jugador", {
          description: "Revisa los datos e intenta nuevamente.",
        });

        return;
      }

      onCreated(data);

      toast.success("Jugador registrado correctamente", {
        description: `${data.nombre} se agregó al plantel.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error inesperado:", error);

      toast.error("Ocurrió un error inesperado", {
        description: "Intenta registrar al jugador nuevamente.",
      });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(abierto) => {
        if (!abierto) setError(null);
        onOpenChange(abierto);
      }}
      variant="blur"
    >
      <Modal.Container placement="center" scroll="inside">
        <Modal.Dialog className="pl-surface h-auto max-h-[90dvh] overflow-hidden rounded-lg border border-(--pl-line) sm:max-w-md">
          <Modal.CloseTrigger />

          {/* Banda roja: repite el gesto de la portada */}
          <div aria-hidden="true" className="h-2 w-full bg-(--pl-sash)" />

          <Modal.Header className="px-6 pt-6">
            <Modal.Heading className="pl-display text-4xl font-black leading-none">
              Registrar jugador
            </Modal.Heading>
            <p className="mt-2 text-sm text-(--pl-muted)">
              Completa los cuatro datos para sumarlo al plantel.
            </p>
          </Modal.Header>

          <Form onSubmit={handleSubmit} className="flex flex-col">
            <Modal.Body className="flex flex-col gap-5 px-6 py-5">
              <TextField
                isRequired
                name="nombre"
                className="flex w-full flex-col gap-1.5"
              >
                <Label className={labelClass}>Nombre</Label>
                <Input
                  placeholder="Nombre completo"
                  variant="primary"
                  className="w-full"
                  autoComplete="off"
                />
                <FieldError />
              </TextField>

              <Select
                name="posicion"
                isRequired
                variant="primary"
                placeholder="Selecciona la posición"
                className="flex w-full flex-col gap-1.5"
              >
                <Label className={labelClass}>Posición</Label>

                <Select.Trigger className="w-full">
                  <Select.Value/>
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
                isRequired
                name="dorsal"
                className="flex w-full flex-col gap-1.5"
                validate={(valor) => {
                  const numero = Number(valor);
                  if (!Number.isInteger(numero) || numero < 1 || numero > 99)
                    return "Ingresa un dorsal entre 1 y 99.";
                }}
              >
                <Label className={labelClass}>Dorsal</Label>
                <Input
                  placeholder="10"
                  variant="primary"
                  className="w-full"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={99}
                />
                <FieldError />
              </TextField>

              <DateField className="w-full" name="fechaDeNacimiento" isRequired>
                <Label className={labelClass}>Fecha de nacimiento</Label>
                <DateField.Group>
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                </DateField.Group>
              </DateField>

              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-(--pl-sash) px-3 py-2 text-sm font-medium text-(--pl-sash)"
                >
                  {error}
                </p>
              )}
            </Modal.Body>

            <Modal.Footer className="gap-3 border-t border-(--pl-line) px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onPress={() => onOpenChange(false)}
                className="transition-colors duration-200 hover:bg-(--pl-line) hover:text-(--pl-ink)"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                isPending={guardando}
                className="bg-(--pl-sash) font-semibold text-white! transition-colors duration-200 hover:bg-(--pl-sash)/85"
              >
                {guardando ? "Registrando…" : "Registrar jugador"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

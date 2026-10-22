import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { supabase } from "../utils/supabase";
import PlayersTable from "../components/PlayersTable";
import CreatePlayerModal from "../components/CreatePlayerModal";
import EditPlayerModal from "../components/EditPlayerModal";
import DeletePlayerModal from "../components/DeletePlayerModal";

function EstadoVacio({ onRegistrar }) {
  return (
    <section className="pl-state">
      <span className="pl-state-kicker">EL EQUIPO TE ESPERA</span>
      <h3 className="pl-display text-4xl font-extrabold sm:text-5xl">
        El plantel está vacío.
      </h3>
      <p className="max-w-md text-(--pl-muted)">
        Registra al primer jugador para empezar a armar tu selección.
      </p>
      <Button
        onPress={onRegistrar}
        className="bg-(--pl-sash) font-semibold text-white"
      >
        Registrar jugador
      </Button>
    </section>
  );
}

function EstadoError({ mensaje, onReintentar }) {
  return (
    <section role="alert" className="pl-state pl-state-error">
      <span className="pl-state-kicker">ERROR DE CONEXIÓN</span>
      <h3 className="pl-display text-4xl font-extrabold sm:text-5xl">
        No pudimos cargar el plantel.
      </h3>
      <p className="max-w-lg text-(--pl-muted)">
        {mensaje ||
          "Comprueba tu conexión e inténtalo nuevamente. Tus jugadores no se han eliminado."}
      </p>
      <Button
        onPress={onReintentar}
        className="bg-(--pl-ink) font-semibold text-(--pl-bg)"
      >
        Reintentar
      </Button>
    </section>
  );
}

function EstadoSinResultados({ onLimpiar }) {
  return (
    <section className="pl-state">
      <span className="pl-state-kicker">SIN COINCIDENCIAS</span>
      <h3 className="pl-display text-3xl font-extrabold sm:text-4xl">
        No hay jugadores en esta posición.
      </h3>
      <p className="text-(--pl-muted)">
        Prueba con otra posición para consultar el plantel.
      </p>
      <Button variant="outline" onPress={onLimpiar}>
        Ver todos los jugadores
      </Button>
    </section>
  );
}

function CargandoPlantel() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-(--pl-line) bg-(--pl-surface) px-4 py-3">
      <Spinner className="text-success" size="lg" />

      <div>
        <p className="text-sm font-bold tracking-wide text-(--pl-ink)">
          Mundial 2026
        </p>
        <p className="text-xs text-(--pl-muted)">Convocando jugadores...</p>
      </div>

      <span className="ml-auto text-lg" aria-hidden="true">
        ⚽
      </span>
    </div>
  );
}

export default function PlayersPage() {
  const [jugadores, setJugadores] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [mensajeError, setMensajeError] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [jugadorEliminar, setJugadorEliminar] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function obtenerJugadores() {
      setEstado("cargando");
      setMensajeError("");

      const { data, error } = await supabase.from("jugadores").select("*");

      if (cancelado) return;

      if (error) {
        console.error("Error al cargar jugadores:", error);
        setMensajeError(
          "No fue posible obtener los datos desde Supabase. Revisa la conexión y vuelve a intentarlo.",
        );
        setEstado("error");
        return;
      }

      setJugadores(data ?? []);
      setEstado("listo");
    }

    obtenerJugadores();

    return () => {
      cancelado = true;
    };
  }, [intentoCarga]);

  const cargarJugadores = useCallback(() => {
    setIntentoCarga((intento) => intento + 1);
  }, []);

  const posiciones = useMemo(
    () =>
      [...new Set(jugadores.map((j) => j.posicion).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "es"),
      ),
    [jugadores],
  );

  const visibles = useMemo(
    () =>
      jugadores
        .filter((j) => filtro === "todos" || j.posicion === filtro)
        .sort((a, b) => Number(a.dorsal) - Number(b.dorsal)),
    [jugadores, filtro],
  );

  const total = jugadores.length;
  const resumen =
    estado === "cargando"
      ? "Cargando plantel"
      : `${total} ${total === 1 ? "jugador" : "jugadores"}`;

  function handleCreated(nuevo) {
    setJugadores((previos) => [...previos, nuevo]);
    setFiltro("todos");
  }
  function handleEdit(jugador) {
    setJugadorSeleccionado(jugador);
    setEditOpen(true);
  }

  function handleUpdated(jugadorActualizado) {
    setJugadores((actuales) =>
      actuales.map((jugador) =>
        jugador.id === jugadorActualizado.id ? jugadorActualizado : jugador,
      ),
    );
  }

  function handleDelete(jugador) {
    setJugadorEliminar(jugador);
    setDeleteOpen(true);
  }

  function handleDeleted(id) {
    setJugadores((actuales) => actuales.filter((jugador) => jugador.id !== id));

    setJugadorEliminar(null);
  }
  return (
    <div className="pl-page">
      <section className="pl-hero pb-14 sm:pb-20">
        <div className="pl-hero-inner mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="pl-kicker">FOOTBALL PLAYERS</span>
            <span className="pl-kicker-line" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--pl-muted)">
              Tabla de jugadores
            </span>
          </div>

          <h1 className="pl-title">
            Football <span className="pl-title-accent">Players</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-(--pl-muted) sm:text-lg">
            Cada dorsal cuenta. Consulta, organiza y administra a los jugadores
            de tu selección.
          </p>
        </div>

        <div className="relative mt-10 sm:mt-14">
          <div className="pl-band">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-8 sm:py-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  Lista de todos los jugadores
                </p>
                <p
                  className="pl-display mt-1 text-4xl font-extrabold leading-none sm:text-5xl"
                  aria-live="polite"
                >
                  {resumen}
                </p>
              </div>

              <Button
                size="lg"
                onPress={() => setModalAbierto(true)}
                className="bg-white font-bold text-[#0f2a1e] shadow-sm transition-transform hover:scale-[1.02]"
              >
                + Registrar jugador
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="pl-section-label">RANKING</p>
            <h2 className="pl-display mt-1 text-5xl font-black leading-none sm:text-6xl">
              Jugadores<span className="text-(--pl-sash)">.</span>
            </h2>
          </div>

          {estado === "listo" && posiciones.length > 0 && (
            <div
              role="group"
              aria-label="Filtrar jugadores por posición"
              className="flex flex-wrap gap-2"
            >
              {["todos", ...posiciones].map((posicion) => {
                const activo = filtro === posicion;

                return (
                  <Button
                    key={posicion}
                    size="sm"
                    variant={activo ? "primary" : "outline"}
                    aria-pressed={activo}
                    onPress={() => setFiltro(posicion)}
                    className={
                      activo
                        ? "bg-(--pl-ink)] font-bold text-(--pl-bg)"
                        : "border-(--pl-line)] text-(--pl-ink)"
                    }
                  >
                    {posicion === "todos" ? "Todos" : posicion}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {estado === "cargando" && <CargandoPlantel />}

        {estado === "error" && (
          <EstadoError mensaje={mensajeError} onReintentar={cargarJugadores} />
        )}

        {estado === "listo" && total === 0 && (
          <EstadoVacio onRegistrar={() => setModalAbierto(true)} />
        )}

        {estado === "listo" && total > 0 && visibles.length === 0 && (
          <EstadoSinResultados onLimpiar={() => setFiltro("todos")} />
        )}

        {estado === "listo" && visibles.length > 0 && (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-(--pl-muted)">
              <p>
                Mostrando{" "}
                <strong className="text-(--pl-ink)">{visibles.length}</strong>{" "}
                de {total} jugadores
              </p>
              <p className="uppercase tracking-wider">Ordenados por dorsal</p>
            </div>

            <PlayersTable
              jugadores={visibles}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </>
        )}
      </main>

      <EditPlayerModal
        key={jugadorSeleccionado?.id}
        jugador={jugadorSeleccionado}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={handleUpdated}
      />

      <CreatePlayerModal
        isOpen={modalAbierto}
        onOpenChange={setModalAbierto}
        onCreated={handleCreated}
      />

      <DeletePlayerModal
        jugador={jugadorEliminar}
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={handleDeleted}
      />
    </div>
  );
}

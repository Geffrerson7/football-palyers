import { Table, Button, Chip } from "@heroui/react";
import { formatearFecha } from "../utils/jugadores";
import { useState } from "react";
import { Link } from "react-router";

const JUGADORES_POR_PAGINA = 10;
export default function PlayersTable({ jugadores, onDelete, onEdit }) {
  const [pagina, setPagina] = useState(1);

  const totalJugadores = jugadores.length;
  const totalPaginas = Math.ceil(totalJugadores / JUGADORES_POR_PAGINA);

  const paginaActual = Math.min(pagina, Math.max(totalPaginas, 1));

  const inicio = (paginaActual - 1) * JUGADORES_POR_PAGINA;

  const jugadoresPaginados = jugadores.slice(
    inicio,
    inicio + JUGADORES_POR_PAGINA,
  );
  return (
    <section className="pl-table-wrap">
      <div className="pl-table-topline">
        <span className="pl-table-topline-mark" />
        <span>LISTA OFICIAL</span>
        <span className="ml-auto">
          {jugadores.length.toString().padStart(2, "0")} JUG.
        </span>
      </div>

      <Table className="pl-table">
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de jugadores del plantel">
            <Table.Header>
              <Table.Column isRowHeader>Dorsal</Table.Column>
              <Table.Column>Jugador</Table.Column>
              <Table.Column>Posición</Table.Column>
              <Table.Column>Estado</Table.Column>
              <Table.Column>Fecha de nacimiento</Table.Column>
              <Table.Column>Acciones</Table.Column>
            </Table.Header>

            <Table.Body>
              {jugadoresPaginados.map((jugador) => {
                return (
                  <Table.Row key={jugador.id}>
                    <Table.Cell>
                      <span className="pl-table-numeral">
                        {String(jugador.dorsal ?? "—").padStart(2, "0")}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="min-w-36">
                        <Link
                          to={`/jugadores/${jugador.id}`}
                          className="font-semibold underline underline-offset-4"
                        >
                          {jugador.nombre}
                        </Link>
                        <p className="mt-0.5 text-xs text-(--pl-muted)">
                          {jugador.activo
                            ? "Disponible para convocatoria"
                            : "Fuera de convocatoria"}
                        </p>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <span className="inline-flex rounded-md border border-(--pl-line) px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
                        {jugador.posicion || "Sin posición"}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <Chip
                        color={jugador.activo ? "success" : "danger"}
                        variant="soft"
                        size="sm"
                      >
                        {jugador.activo ? "Activo" : "Retirado"}
                      </Chip>
                    </Table.Cell>

                    <Table.Cell>
                      <span className="whitespace-nowrap text-sm text-(--pl-muted)">
                        {formatearFecha(jugador.fecha_nacimiento)}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          onPress={() => onEdit(jugador)}
                          variant="ghost"
                          aria-label={`Editar a ${jugador.nombre}`}
                          className="border-blue-500/40 text-blue-700 hover:bg-blue-500/10 dark:text-blue-300"
                        >
                          Editar
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => onDelete(jugador)}
                          className="border-red-500/40 text-red-700 hover:bg-red-500/10 dark:text-red-300"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <div className="flex flex-col gap-3 border-t border-(--pl-line) px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-(--pl-muted)">
          {totalJugadores === 0
            ? "No hay jugadores"
            : `Mostrando ${inicio + 1}–${Math.min(
                inicio + JUGADORES_POR_PAGINA,
                totalJugadores,
              )} de ${totalJugadores} jugadores`}
        </p>

        <div
          className="flex items-center justify-end gap-2"
          aria-label="Paginación de jugadores"
        >
          <button
            type="button"
            onClick={() => setPagina((actual) => actual - 1)}
            disabled={paginaActual === 1}
            className="rounded-md border border-(--pl-line) px-3 py-2 text-sm font-semibold text-(--pl-ink) transition-colors hover:bg-(--pl-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="px-2 text-sm font-bold text-(--pl-ink)">
            {paginaActual} / {Math.max(totalPaginas, 1)}
          </span>

          <button
            type="button"
            onClick={() => setPagina((actual) => actual + 1)}
            disabled={paginaActual >= totalPaginas}
            className="rounded-md border border-(--pl-line) px-3 py-2 text-sm font-semibold text-(--pl-ink) transition-colors hover:bg-(--pl-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}

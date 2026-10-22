
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";
import { supabase } from "../utils/supabase";
import "./PlayerDetail.css";

function formatDate(date) {
  if (!date) return "No disponible";

  return new Date(`${date}T00:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getAge(date) {
  if (!date) return null;

  const today = new Date();
  const birthDate = new Date(`${date}T00:00:00`);

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!birthdayHasPassed) age--;

  return age;
}

export default function PlayerDetail() {
  const { id } = useParams();

  const [jugador, setJugador] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function obtenerJugador() {
      setLoading(true);
      setError("");
      setJugador(null);
      setDetalle(null);

      if (!/^\d+$/.test(id ?? "")) {
        setError("El identificador del jugador no es válido.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: queryError } = await supabase
          .from("jugadores")
          .select(`
            id,
            nombre,
            posicion,
            dorsal,
            activo,
            fecha_nacimiento,
            detalle_jugadores (
              nacionalidad,
              altura_cm,
              peso_kg,
              pie_habil,
              club_actual,
              foto_url,
              biografia
            )
          `)
          .eq("id", Number(id))
          .maybeSingle();

        if (queryError) throw queryError;

        if (cancelled) return;

        if (!data) {
          setError("No encontramos al jugador solicitado.");
          return;
        }

        setJugador(data);

        const datosDetalle = data.detalle_jugadores;
        setDetalle(
          Array.isArray(datosDetalle)
            ? datosDetalle[0] ?? null
            : datosDetalle
        );
      } catch (err) {
        console.error("Error al obtener el jugador:", err);

        if (!cancelled) {
          setError("No se pudo cargar el perfil. Inténtalo nuevamente.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    obtenerJugador();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="pl-page pl-detail-page">
        <div className="pl-detail-state" role="status">
          <span className="pl-detail-spinner" />
          <p>Cargando perfil del jugador...</p>
        </div>
      </main>
    );
  }

  if (error || !jugador) {
    return (
      <main className="pl-page pl-detail-page">
        <div className="pl-detail-state pl-detail-error" role="alert">
          <span className="pl-kicker">ERROR / 404</span>
          <h1>{error || "Jugador no encontrado"}</h1>
          <p>Comprueba el enlace o regresa al listado del plantel.</p>
          <Link className="pl-detail-back" to="/jugadores">
            ← Volver al plantel
          </Link>
        </div>
      </main>
    );
  }

  const edad = getAge(jugador.fecha_nacimiento);

  return (
    <main className="pl-page pl-detail-page">
      <div className="pl-detail-container">
        <nav className="pl-detail-breadcrumb" aria-label="Navegación">
          <Link to="/jugadores">Plantel</Link>
          <span>/</span>
          <span aria-current="page">{jugador.nombre}</span>
        </nav>

        <section className="pl-detail-hero">
          <div className="pl-detail-photo">
            {detalle?.foto_url ? (
              <img
                src={detalle.foto_url}
                alt={`Fotografía de ${jugador.nombre}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : null}

            {!detalle?.foto_url && (
              <span className="pl-detail-initials" aria-hidden="true">
                {jugador.nombre
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}

            <span className="pl-detail-dorsal">
              {String(jugador.dorsal).padStart(2, "0")}
            </span>
          </div>

          <div className="pl-detail-intro">
            <span className="pl-kicker">PERFIL DEL JUGADOR</span>

            <h1 className="pl-detail-name">{jugador.nombre}</h1>

            <p className="pl-detail-position">
              {jugador.posicion || "Posición no registrada"}
            </p>

            <div className="pl-detail-tags">
              <span className="pl-detail-tag">
                Dorsal {jugador.dorsal}
              </span>

              <span
                className={`pl-detail-status ${
                  jugador.activo
                    ? "pl-detail-status-active"
                    : "pl-detail-status-inactive"
                }`}
              >
                {jugador.activo ? "Activo" : "Inactivo"}
              </span>
            </div>

            <Link className="pl-detail-back" to="/jugadores">
              ← Volver al plantel
            </Link>
          </div>
        </section>

        <section className="pl-detail-section">
          <div className="pl-detail-section-heading">
            <span className="pl-section-label">01 / INFORMACIÓN</span>
            <h2>Ficha deportiva</h2>
          </div>

          <dl className="pl-detail-grid">
            <div className="pl-detail-field">
              <dt>Nacionalidad</dt>
              <dd>{detalle?.nacionalidad || "No disponible"}</dd>
            </div>

            <div className="pl-detail-field">
              <dt>Fecha de nacimiento</dt>
              <dd>{formatDate(jugador.fecha_nacimiento)}</dd>
            </div>

            <div className="pl-detail-field">
              <dt>Edad</dt>
              <dd>{edad !== null ? `${edad} años` : "No disponible"}</dd>
            </div>

            <div className="pl-detail-field">
              <dt>Altura</dt>
              <dd>
                {detalle?.altura_cm
                  ? `${detalle.altura_cm} cm`
                  : "No disponible"}
              </dd>
            </div>

            <div className="pl-detail-field">
              <dt>Peso</dt>
              <dd>
                {detalle?.peso_kg
                  ? `${detalle.peso_kg} kg`
                  : "No disponible"}
              </dd>
            </div>

            <div className="pl-detail-field">
              <dt>Pie hábil</dt>
              <dd>{detalle?.pie_habil || "No disponible"}</dd>
            </div>

            <div className="pl-detail-field pl-detail-field-wide">
              <dt>Club actual</dt>
              <dd>{detalle?.club_actual || "No disponible"}</dd>
            </div>
          </dl>
        </section>

        <section className="pl-detail-section pl-detail-biography">
          <div className="pl-detail-section-heading">
            <span className="pl-section-label">02 / TRAYECTORIA</span>
            <h2>Sobre el jugador</h2>
          </div>

          <p>
            {detalle?.biografia ||
              "La información biográfica de este jugador aún no está disponible."}
          </p>
        </section>
      </div>
    </main>
  );
}

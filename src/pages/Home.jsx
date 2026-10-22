
import { Link } from "react-router";
import "./Home.css";

const sections = [
  {
    number: "01",
    title: "Jugadores",
    description:
      "Consulta el plantel, explora perfiles y conoce la información de cada futbolista.",
    to: "/jugadores",
    action: "Explorar jugadores",
  },
  {
    number: "02",
    title: "Equipos",
    description:
      "Organiza las selecciones, sus confederaciones y sus grupos.",
    to: "/equipos",
    action: "Ver equipos",
  },
  {
    number: "03",
    title: "Partidos",
    description:
      "Consulta los enfrentamientos, resultados y las distintas fases del torneo.",
    to: "/partidos",
    action: "Explorar partidos",
  },
];

export default function Home() {
  return (
    <main className="pl-page fp-home">
      <section className="fp-home-hero">
        <div className="fp-home-pitch-lines" aria-hidden="true">
          <span className="fp-home-center-circle" />
          <span className="fp-home-center-line" />
        </div>

        <div className="fp-home-hero-inner">
          <div className="fp-home-kicker">
            <span className="pl-kicker-line" />
            <span className="pl-kicker">THE BEAUTIFUL GAME</span>
          </div>

          <h1 className="fp-home-title">
            FOOTBALL
            <span>PLAYERS.</span>
          </h1>

          <div className="fp-home-band">
            <span>UN JUEGO.</span>
            <span>MILES DE HISTORIAS.</span>
          </div>

          <div className="fp-home-intro">
            <p>
              Explora el mundo del fútbol desde sus protagonistas
              hasta los equipos y partidos que hacen historia.
            </p>

            <Link to="/jugadores" className="fp-home-cta">
              EXPLORAR PLANTEL
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="fp-home-edition">
            <span>FOOTBALL DATABASE</span>
            <span>EDITION / 2026</span>
          </div>
        </div>
      </section>

      <section className="fp-home-sections">
        <div className="fp-home-section-heading">
          <div>
            <span className="pl-section-label">EXPLORA LA PLATAFORMA</span>
            <h2>EL UNIVERSO DEL FÚTBOL</h2>
          </div>

          <span className="fp-home-section-count">03 SECCIONES</span>
        </div>

        <div className="fp-home-card-grid">
          {sections.map((section) => (
            <article className="fp-home-card" key={section.number}>
              <div className="fp-home-card-top">
                <span className="fp-home-card-number">
                  {section.number}
                </span>

                <span className="fp-home-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>

              <h3>{section.title}</h3>
              <p>{section.description}</p>

              <Link to={section.to} className="fp-home-card-link">
                {section.action}
                <span aria-hidden="true"> →</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

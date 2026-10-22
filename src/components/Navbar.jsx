import { ThemeSwitcher } from "./theme-switcher";
import { NavLink } from "react-router";

const navigation = [
  { label: "Inicio", to: "/", end: true },
  { label: "Jugadores", to: "/jugadores" },
  { label: "Equipos", to: "/equipos" },
  { label: "Partidos", to: "/partidos" },
];

export default function Navbar() {
  return (
    <header className="border-b border-(--pl-line) bg-(--pl-surface) px-5 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center bg-(--pl-pitch) font-black text-white">
            FP
          </span>

          <span className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-(--pl-ink)">
              FOOTBALL PLAYERS
            </span>
            <span className="text-xs tracking-widest text-(--pl-muted)">
              FOOTBALL DATABASE
            </span>
          </span>
        </NavLink>

        {/* Navegación y tema */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <nav
            aria-label="Navegación principal"
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            {navigation.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-(--pl-sash)"
                      : "text-(--pl-muted) hover:text-(--pl-ink)"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

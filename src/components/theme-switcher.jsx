import { Button, useTheme } from "@heroui/react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme, theme } = useTheme("system");

  const estiloActivo =
    "bg-(--pl-sash) text-white";
  const estiloInactivo =
    "bg-transparent text-(--pl-ink) hover:bg-(--pl-bg)";

  return (
    <div
      role="group"
      aria-label="Seleccionar tema"
      className="inline-flex items-center gap-1 rounded-xl border border-(--pl-line) bg-(--pl-surface) p-1"
    >
      <Button
        size="sm"
        variant="ghost"
        aria-label="Tema claro"
        aria-pressed={resolvedTheme === "light" && theme !== "system"}
        onPress={() => setTheme("light")}
        className={`gap-2 rounded-lg px-3 py-2 ${
          resolvedTheme === "light" && theme !== "system"
            ? estiloActivo
            : estiloInactivo
        }`}
      >
        <FiSun size={20} />
        <span className="hidden sm:inline">Claro</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        aria-label="Tema oscuro"
        aria-pressed={resolvedTheme === "dark" && theme !== "system"}
        onPress={() => setTheme("dark")}
        className={`gap-2 rounded-lg px-3 py-2 ${
          resolvedTheme === "dark" && theme !== "system"
            ? estiloActivo
            : estiloInactivo
        }`}
      >
        <FiMoon size={20} />
        <span className="hidden sm:inline">Oscuro</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        aria-label="Tema del sistema"
        aria-pressed={theme === "system"}
        onPress={() => setTheme("system")}
        className={`gap-2 rounded-lg px-3 py-2 ${
          theme === "system" ? estiloActivo : estiloInactivo
        }`}
      >
        <FiMonitor size={20} />
        <span className="hidden sm:inline">Sistema</span>
      </Button>
    </div>
  );
}
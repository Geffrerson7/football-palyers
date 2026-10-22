// Lee la fecha de nacimiento sin importar cómo se llame la columna en Supabase.
export function fechaNacimiento(jugador) {
  return (
    jugador.fechaDeNacimiento ??
    jugador.fecha_nacimiento ??
    jugador.fecha_de_nacimiento ??
    null
  );
}

export function calcularEdad(fecha) {
  if (!fecha) return null;
  const nacimiento = new Date(fecha);
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) edad -= 1;
  return edad;
}

// "2000-05-14" → "14 may 2000" (sin desfase por zona horaria)
export function formatearFecha(fecha) {
  if (!fecha) return "—";
  const [anio, mes, dia] = String(fecha).slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return "—";
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
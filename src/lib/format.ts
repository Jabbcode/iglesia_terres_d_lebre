type DiaSemana =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO"
  | "DOMINGO";

const DIA_NOMBRES: Record<DiaSemana, string> = {
  DOMINGO: "Domingos",
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábados",
};

const DIA_JS_INDEX: Record<DiaSemana, number> = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

export function formatDayTime(dia: DiaSemana, hora: string): string {
  const nombre = DIA_NOMBRES[dia] ?? dia;
  return `${nombre}, ${hora}h`;
}

export function getDayName(dia: DiaSemana): string {
  return DIA_NOMBRES[dia] ?? dia;
}

export function getNextDayDate(dia: DiaSemana, hora: string): Date {
  const now = new Date();
  const targetDay = DIA_JS_INDEX[dia];
  const currentDay = now.getDay();

  let daysUntil = targetDay - currentDay;
  if (daysUntil < 0) daysUntil += 7;
  if (daysUntil === 0) {
    const [h, m] = hora.split(":").map(Number);
    const todayTarget = new Date(now);
    todayTarget.setHours(h, m, 0, 0);
    if (now >= todayTarget) daysUntil = 7;
  }

  const target = new Date(now);
  target.setDate(now.getDate() + daysUntil);
  const [h, m] = hora.split(":").map(Number);
  target.setHours(h, m, 0, 0);
  return target;
}

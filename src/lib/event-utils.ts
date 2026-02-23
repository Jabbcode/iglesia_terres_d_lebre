type Periodicidad = "ninguna" | "semanal" | "quincenal" | "mensual" | "anual"

interface EventoBase {
  fecha: Date | string
  periodicidad: Periodicidad
  repetirHasta?: Date | string | null
}

/**
 * Calcula la próxima ocurrencia de un evento basado en su periodicidad
 * @param evento - Evento con fecha base y periodicidad
 * @param fromDate - Fecha desde la cual calcular (default: hoy)
 * @returns La próxima fecha de ocurrencia o null si ya expiró
 */
export function calcularProximaOcurrencia(
  evento: EventoBase,
  fromDate: Date = new Date()
): Date | null {
  const fechaBase = new Date(evento.fecha)
  const repetirHasta = evento.repetirHasta
    ? new Date(evento.repetirHasta)
    : null

  // Normalizar fechas a inicio del día para comparaciones
  const hoy = new Date(fromDate)
  hoy.setHours(0, 0, 0, 0)

  // Si no es periódico, retornar la fecha base si es futura
  if (evento.periodicidad === "ninguna") {
    const fechaNormalizada = new Date(fechaBase)
    fechaNormalizada.setHours(0, 0, 0, 0)
    return fechaNormalizada >= hoy ? fechaBase : null
  }

  // Calcular próxima ocurrencia según periodicidad
  let proximaFecha = new Date(fechaBase)

  while (proximaFecha < hoy) {
    proximaFecha = agregarPeriodo(proximaFecha, evento.periodicidad)
  }

  // Verificar si excede la fecha límite
  if (repetirHasta) {
    const limiteNormalizado = new Date(repetirHasta)
    limiteNormalizado.setHours(23, 59, 59, 999)
    if (proximaFecha > limiteNormalizado) {
      return null
    }
  }

  return proximaFecha
}

/**
 * Agrega un periodo a una fecha según la periodicidad
 */
function agregarPeriodo(fecha: Date, periodicidad: Periodicidad): Date {
  const nueva = new Date(fecha)

  switch (periodicidad) {
    case "semanal":
      nueva.setDate(nueva.getDate() + 7)
      break
    case "quincenal":
      nueva.setDate(nueva.getDate() + 14)
      break
    case "mensual":
      // Guardar el día original para manejar meses con menos días
      const diaOriginal = fecha.getDate()
      nueva.setMonth(nueva.getMonth() + 1)
      // Si el día cambió (ej: 31 de enero → 3 de marzo), ajustar al último día del mes
      if (nueva.getDate() !== diaOriginal) {
        nueva.setDate(0) // Ir al último día del mes anterior
      }
      break
    case "anual":
      nueva.setFullYear(nueva.getFullYear() + 1)
      // Manejar 29 de febrero en años no bisiestos
      if (nueva.getDate() !== fecha.getDate()) {
        nueva.setDate(0)
      }
      break
    default:
      break
  }

  return nueva
}

/**
 * Verifica si un evento está vigente (tiene próxima ocurrencia)
 */
export function eventoEstaVigente(evento: EventoBase): boolean {
  return calcularProximaOcurrencia(evento) !== null
}

/**
 * Formatea la periodicidad para mostrar en UI
 */
export function formatearPeriodicidad(periodicidad: Periodicidad): string {
  const labels: Record<Periodicidad, string> = {
    ninguna: "Una vez",
    semanal: "Semanal",
    quincenal: "Quincenal",
    mensual: "Mensual",
    anual: "Anual",
  }
  return labels[periodicidad]
}

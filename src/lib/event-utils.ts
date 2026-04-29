import type { Periodicidad } from "@/lib/constants"

interface EventoBase {
  fecha: Date | string
  periodicidad: Periodicidad
  semanaDelMes?: number | null
  diaSemanaRelativo?: number | null
  repetirHasta?: Date | string | null
}

export function calcularProximaOcurrencia(
  evento: EventoBase,
  fromDate: Date = new Date()
): Date | null {
  const fechaBase = new Date(evento.fecha)
  const repetirHasta = evento.repetirHasta
    ? new Date(evento.repetirHasta)
    : null

  const hoy = new Date(fromDate)
  hoy.setHours(0, 0, 0, 0)

  if (evento.periodicidad === "ninguna") {
    const fechaNormalizada = new Date(fechaBase)
    fechaNormalizada.setHours(0, 0, 0, 0)
    return fechaNormalizada >= hoy ? fechaBase : null
  }

  let proximaFecha = new Date(fechaBase)

  while (proximaFecha < hoy) {
    proximaFecha = agregarPeriodo(proximaFecha, evento.periodicidad, {
      semanaDelMes: evento.semanaDelMes,
      diaSemanaRelativo: evento.diaSemanaRelativo,
    })
  }

  if (repetirHasta) {
    const limiteNormalizado = new Date(repetirHasta)
    limiteNormalizado.setHours(23, 59, 59, 999)
    if (proximaFecha > limiteNormalizado) return null
  }

  return proximaFecha
}

interface OpcionesMensualRelativo {
  semanaDelMes?: number | null
  diaSemanaRelativo?: number | null
}

function agregarPeriodo(
  fecha: Date,
  periodicidad: Periodicidad,
  opciones: OpcionesMensualRelativo = {}
): Date {
  const nueva = new Date(fecha)

  switch (periodicidad) {
    case "semanal":
      nueva.setDate(nueva.getDate() + 7)
      break
    case "quincenal":
      nueva.setDate(nueva.getDate() + 14)
      break
    case "mensual": {
      const diaOriginal = fecha.getDate()
      nueva.setMonth(nueva.getMonth() + 1)
      if (nueva.getDate() !== diaOriginal) nueva.setDate(0)
      break
    }
    case "mensual_relativo": {
      const diaSemana = opciones.diaSemanaRelativo ?? fecha.getDay()
      const semana = opciones.semanaDelMes ?? Math.ceil(fecha.getDate() / 7)

      const mesBase = nueva.getMonth() + 1
      const anio = mesBase > 11 ? nueva.getFullYear() + 1 : nueva.getFullYear()
      const mes = mesBase > 11 ? 0 : mesBase

      const diasEnMes = new Date(anio, mes + 1, 0).getDate()
      const primerDiaMes = new Date(anio, mes, 1)
      const diff = (diaSemana - primerDiaMes.getDay() + 7) % 7
      const primerOcurrencia = 1 + diff

      let dia: number
      if (semana === -1) {
        dia =
          primerOcurrencia + Math.floor((diasEnMes - primerOcurrencia) / 7) * 7
      } else {
        const candidato = primerOcurrencia + (semana - 1) * 7
        dia = candidato <= diasEnMes ? candidato : candidato - 7
      }

      nueva.setFullYear(anio, mes, dia)
      break
    }
    case "anual":
      nueva.setFullYear(nueva.getFullYear() + 1)
      if (nueva.getDate() !== fecha.getDate()) nueva.setDate(0)
      break
    default:
      break
  }

  return nueva
}

export function eventoEstaVigente(evento: EventoBase): boolean {
  return calcularProximaOcurrencia(evento) !== null
}

export function formatearPeriodicidad(periodicidad: Periodicidad): string {
  const labels: Record<Periodicidad, string> = {
    ninguna: "Una vez",
    semanal: "Semanal",
    quincenal: "Quincenal",
    mensual: "Mensual",
    mensual_relativo: "Mensual (dia especifico)",
    anual: "Anual",
  }
  return labels[periodicidad]
}

import type { Metadata } from "next"
import { Schedule } from "@/components/sections/schedule"

export const metadata: Metadata = {
  title: "Horarios",
  description:
    "Consulta los horarios de nuestros cultos, reuniones de oración, estudios bíblicos y actividades para niños y jóvenes.",
  keywords: [
    "horario iglesia Tortosa",
    "culto dominical Tortosa",
    "reunión de oración",
    "estudio bíblico Tortosa",
    "actividades para niños iglesia",
    "grupos de jóvenes Tortosa",
    "culte dominical Tortosa",
    "estudi bíblic Terres de l'Ebre",
    "reunió de pregària",
    "grup de joves Tortosa",
  ],
}

export default function SchedulePage() {
  return <Schedule />
}

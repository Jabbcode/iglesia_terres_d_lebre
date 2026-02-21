import type { Metadata } from "next"
import { Schedule } from "@/components/sections/schedule"

export const metadata: Metadata = {
  title: "Horarios",
  description:
    "Consulta los horarios de nuestros cultos, reuniones de oración, estudios bíblicos y actividades para niños y jóvenes.",
}

export default function SchedulePage() {
  return <Schedule />
}

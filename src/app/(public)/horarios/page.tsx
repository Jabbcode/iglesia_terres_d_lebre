import type { Metadata } from "next"
import { Schedule } from "@/components/sections/schedule"
import { IGLESIA_NAME } from "@/lib/constant"

export const metadata: Metadata = {
  title: `Horarios | ${IGLESIA_NAME}`,
  description:
    "Consulta los horarios de nuestros cultos, reuniones de oración, estudios bíblicos y actividades para niños y jóvenes.",
}

export default function SchedulePage() {
  return <Schedule />
}

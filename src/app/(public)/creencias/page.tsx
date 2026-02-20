import type { Metadata } from "next"
import { Beliefs } from "@/components/sections/beliefs"
import { IGLESIA_NAME } from "@/lib/constant"

export const metadata: Metadata = {
  title: `Creencias | ${IGLESIA_NAME}`,
  description:
    "Conoce nuestras creencias fundamentales. Fundamentamos nuestra fe en la Palabra de Dios, en Jesucristo como Salvador y en el Espíritu Santo.",
}

export default function BeliefsPage() {
  return <Beliefs />
}

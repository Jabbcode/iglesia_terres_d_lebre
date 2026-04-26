import type { Metadata } from "next"
import { Beliefs } from "@/components/sections/beliefs"

export const metadata: Metadata = {
  title: "Creencias",
  description:
    "Conoce nuestras creencias fundamentales. Fundamentamos nuestra fe en la Palabra de Dios, en Jesucristo como Salvador y en el Espíritu Santo.",
  keywords: [
    "doctrina cristiana evangélica",
    "creencias evangélicas",
    "la Biblia Palabra de Dios",
    "Trinidad",
    "Jesucristo Salvador",
    "Espíritu Santo",
    "salvación cristiana",
    "bautismo",
    "fe bíblica Tortosa",
    "doctrina iglesia bíblica",
  ],
}

export default function BeliefsPage() {
  return <Beliefs />
}

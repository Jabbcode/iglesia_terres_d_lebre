import type { Metadata } from "next"
import { Contact } from "@/components/sections/contact"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con nuestra comunidad. Visítanos, llámanos o envíanos un mensaje. Nuestras puertas y corazones están abiertos.",
  keywords: [
    "contacto iglesia Tortosa",
    "dirección iglesia Tortosa",
    "teléfono iglesia evangélica",
    "cómo llegar iglesia Tortosa",
    "mapa iglesia Terres de l'Ebre",
    "visitar iglesia Tortosa",
    "redes sociales iglesia",
    "contacte església Tortosa",
  ],
}

export default function ContactPage() {
  return <Contact />
}

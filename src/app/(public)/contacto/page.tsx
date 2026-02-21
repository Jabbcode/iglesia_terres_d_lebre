import type { Metadata } from "next"
import { Contact } from "@/components/sections/contact"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con nuestra comunidad. Visítanos, llámanos o envíanos un mensaje. Nuestras puertas y corazones están abiertos.",
}

export default function ContactPage() {
  return <Contact />
}

import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { UpcomingEvents } from "@/components/sections/upcoming-events";

export const metadata: Metadata = {
  title: "Contacto | Comunidad Cristiana Terres de l'Ebre",
  description:
    "Ponte en contacto con nuestra comunidad. Visítanos, llámanos o envíanos un mensaje. Nuestras puertas y corazones están abiertos.",
};

export default function ContactPage() {
  return (
    <>
      <Contact />
      <UpcomingEvents />
    </>
  );
}

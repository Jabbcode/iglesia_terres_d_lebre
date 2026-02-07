import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { IGLESIA_NAME } from "@/lib/constant";

export const metadata: Metadata = {
  title: `Contacto | ${IGLESIA_NAME}`,
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

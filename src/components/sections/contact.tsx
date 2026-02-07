"use client";

import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { mockConfig } from "@/lib/mock-data";

export function Contact() {
  const direccion = mockConfig.contacto.direccion;
  const telefono = mockConfig.contacto.telefono;
  const horarioAtencion = mockConfig.contacto.horarioAtencion;
  const instagramUrl = mockConfig.redesSociales.instagram;
  const facebookUrl = mockConfig.redesSociales.facebook;
  const youtubeUrl = mockConfig.redesSociales.youtube;
  const googleMapsUrl = mockConfig.contacto.googleMapsUrl;

  return (
    <section id="contacto" className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Nos encantaría{" "}
            <span className="font-serif italic text-amber">saber de ti.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Ya sea que tengas una pregunta sobre nuestros servicios, o
            simplemente quieras saludar, nuestras puertas y corazones están
            abiertos.
          </p>
        </div>

        {/* Info cards grid */}
        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Visit Us */}
          <div className="rounded-2xl border border-border/50 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber/10">
              <MapPin className="size-6 text-amber" />
            </div>
            <h3 className="mb-2 font-bold text-foreground">Visítanos</h3>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {direccion}
            </p>
          </div>

          {/* Call */}
          <div className="rounded-2xl border border-border/50 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber/10">
              <Phone className="size-6 text-amber" />
            </div>
            <h3 className="mb-2 font-bold text-foreground">Llámanos</h3>
            <p className="text-sm text-muted-foreground">{telefono}</p>
          </div>

          {/* Hours */}
          <div className="rounded-2xl border border-border/50 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber/10">
              <Clock className="size-6 text-amber" />
            </div>
            <h3 className="mb-2 font-bold text-foreground">Horario</h3>
            <p className="text-sm text-muted-foreground">{horarioAtencion}</p>
          </div>
        </div>

        {/* Social media */}
        <div className="mx-auto mb-10 flex justify-center gap-4">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-12 items-center justify-center rounded-full border border-border bg-white transition-colors hover:border-amber hover:text-amber"
          >
            <Instagram className="size-5" />
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-12 items-center justify-center rounded-full border border-border bg-white transition-colors hover:border-amber hover:text-amber"
          >
            <Facebook className="size-5" />
          </a>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-12 items-center justify-center rounded-full border border-border bg-white transition-colors hover:border-amber hover:text-amber"
          >
            <Youtube className="size-5" />
          </a>
        </div>

        {/* Map */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/50 shadow-sm">
          <iframe
            title="Ubicación de la iglesia"
            src={googleMapsUrl}
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale transition-all duration-300 hover:grayscale-0"
          />
        </div>
      </div>
    </section>
  );
}

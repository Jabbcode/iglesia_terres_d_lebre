"use client"

import { useEffect } from "react"
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react"
import { useConfigStore } from "@/stores/config-store"
import { FadeInUp } from "@/components/ui/motion"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

interface ContactProps {
  lang: Locale
  dict: Dictionary
}

function decodeHtmlEntities(str: string): string {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = str
  return textarea.value
}

export function Contact({ lang, dict }: ContactProps) {
  const { config, fetchConfig } = useConfigStore()

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const direccion = config?.direccion || ""
  const telefono = config?.telefono || ""
  const horarioAtencion = config?.horarioAtencion || ""
  const instagramUrl = config?.instagram || ""
  const facebookUrl = config?.facebook || ""
  const youtubeUrl = config?.youtube || ""
  const googleMapsEmbed = config?.googleMapsEmbed
    ? decodeHtmlEntities(config.googleMapsEmbed)
    : ""

  return (
    <section id="contacto" className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInUp>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              {dict.contact.pageTitle}{" "}
              <span className="text-amber font-serif italic">{dict.contact.pageTitleEmphasis}</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              {dict.contact.pageDescription}
            </p>
          </div>
        </FadeInUp>

        {/* Info cards grid */}
        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Visit Us */}
          <FadeInUp delay={0}>
            <div className="border-border/50 h-full rounded-2xl border bg-white p-6 text-center shadow-sm">
              <div className="bg-amber/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
                <MapPin className="text-amber size-6" />
              </div>
              <h3 className="text-foreground mb-2 font-bold">{dict.contact.visitUs}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {direccion}
              </p>
            </div>
          </FadeInUp>

          {/* Call */}
          <FadeInUp delay={0.1}>
            <div className="border-border/50 h-full rounded-2xl border bg-white p-6 text-center shadow-sm">
              <div className="bg-amber/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
                <Phone className="text-amber size-6" />
              </div>
              <h3 className="text-foreground mb-2 font-bold">{dict.contact.callUs}</h3>
              <p className="text-muted-foreground text-sm">{telefono}</p>
            </div>
          </FadeInUp>

          {/* Hours */}
          <FadeInUp delay={0.2}>
            <div className="border-border/50 h-full rounded-2xl border bg-white p-6 text-center shadow-sm">
              <div className="bg-amber/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
                <Clock className="text-amber size-6" />
              </div>
              <h3 className="text-foreground mb-2 font-bold">{dict.contact.hours}</h3>
              <p className="text-muted-foreground text-sm">{horarioAtencion}</p>
            </div>
          </FadeInUp>
        </div>

        {/* Social media */}
        {(instagramUrl || facebookUrl || youtubeUrl) && (
          <div className="mx-auto mb-10 flex justify-center gap-4">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:border-amber hover:text-amber flex size-12 items-center justify-center rounded-full border bg-white transition-colors"
              >
                <Instagram className="size-5" />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:border-amber hover:text-amber flex size-12 items-center justify-center rounded-full border bg-white transition-colors"
              >
                <Facebook className="size-5" />
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:border-amber hover:text-amber flex size-12 items-center justify-center rounded-full border bg-white transition-colors"
              >
                <Youtube className="size-5" />
              </a>
            )}
          </div>
        )}

        {/* Map */}
        {googleMapsEmbed && (
          <FadeInUp delay={0.3}>
            <div className="border-border/50 mx-auto max-w-4xl overflow-hidden rounded-2xl border shadow-sm">
              <iframe
                title={dict.contact.mapTitle}
                src={googleMapsEmbed}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-300 hover:grayscale-0"
              />
            </div>
          </FadeInUp>
        )}
      </div>
    </section>
  )
}

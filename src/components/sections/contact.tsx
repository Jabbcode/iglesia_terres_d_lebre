"use client"

import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react"
import { FadeInUp } from "@/components/ui/motion"
import { siteConfig } from "@/config/site"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

interface ContactProps {
  lang: Locale
  dict: Dictionary
}

export function Contact({ lang: _lang, dict }: ContactProps) {
  const { direccion, telefono, horarioAtencion, googleMapsEmbed } = siteConfig.contact
  const { instagram: instagramUrl, facebook: facebookUrl, youtube: youtubeUrl } = siteConfig.socialMedia

  return (
    <section id="contacto" className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInUp>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              {dict.contact.pageTitle}{" "}
              <span className="text-amber font-serif italic">
                {dict.contact.pageTitleEmphasis}
              </span>
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
              <h3 className="text-foreground mb-2 font-bold">
                {dict.contact.visitUs}
              </h3>
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
              <h3 className="text-foreground mb-2 font-bold">
                {dict.contact.callUs}
              </h3>
              <a
                href={`tel:${telefono.replace(/\s+/g, "")}`}
                className="text-muted-foreground hover:text-amber text-sm transition-colors"
              >
                {telefono}
              </a>
            </div>
          </FadeInUp>

          {/* Hours */}
          <FadeInUp delay={0.2}>
            <div className="border-border/50 h-full rounded-2xl border bg-white p-6 text-center shadow-sm">
              <div className="bg-amber/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
                <Clock className="text-amber size-6" />
              </div>
              <h3 className="text-foreground mb-2 font-bold">
                {dict.contact.hours}
              </h3>
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
                aria-label={dict.contact.ariaInstagram}
                className="border-border hover:border-amber hover:text-amber flex size-12 items-center justify-center rounded-full border bg-white transition-colors"
              >
                <Instagram className="size-5" aria-hidden="true" />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.contact.ariaFacebook}
                className="border-border hover:border-amber hover:text-amber flex size-12 items-center justify-center rounded-full border bg-white transition-colors"
              >
                <Facebook className="size-5" aria-hidden="true" />
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.contact.ariaYoutube}
                className="border-border hover:border-amber hover:text-amber flex size-12 items-center justify-center rounded-full border bg-white transition-colors"
              >
                <Youtube className="size-5" aria-hidden="true" />
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

import { IGLESIA_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constant"
import { siteConfig } from "@/config/site"

const sameAs = [
  siteConfig.socialMedia.instagram,
  siteConfig.socialMedia.facebook,
  siteConfig.socialMedia.youtube,
].filter((url): url is string => url !== null)

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: IGLESIA_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs,
  }
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: IGLESIA_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    telephone: siteConfig.contact.telefono,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carrer d'Ulldecona, 3",
      addressLocality: "Tortosa",
      addressRegion: "Tarragona",
      postalCode: "43500",
      addressCountry: "ES",
    },
    hasMap: siteConfig.contact.googleMapsUrl,
    openingHours: "Su 11:30",
    sameAs,
  }
}

interface EventJsonLdInput {
  nombre: string
  descripcion: string | null
  fecha: Date
  horaInicio: string | null
  ubicacion: string | null
}

export function eventSchema(evento: EventJsonLdInput) {
  const dateStr = evento.fecha.toISOString().slice(0, 10)
  const startDate = evento.horaInicio
    ? `${dateStr}T${evento.horaInicio}`
    : dateStr

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.nombre,
    ...(evento.descripcion && { description: evento.descripcion }),
    startDate,
    location: evento.ubicacion
      ? {
          "@type": "Place",
          name: evento.ubicacion,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Tortosa",
            addressCountry: "ES",
          },
        }
      : {
          "@type": "Place",
          name: IGLESIA_NAME,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Carrer d'Ulldecona, 3",
            addressLocality: "Tortosa",
            addressRegion: "Tarragona",
            postalCode: "43500",
            addressCountry: "ES",
          },
        },
    organizer: {
      "@type": "Organization",
      name: IGLESIA_NAME,
      url: SITE_URL,
    },
  }
}

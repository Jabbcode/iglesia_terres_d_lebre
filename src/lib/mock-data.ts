/**
 * Mock data for UI-only mode
 * This file centralizes all mock data used when the backend is disabled.
 * To revert to backend mode, restore the fetch/Prisma calls in components.
 */

// Site configuration
export const mockConfig = {
  general: {
    nombreIglesia: "Iglesia Bíblica Terres de l'Ebre",
    descripcion:
      "Somos una familia de fe en Terres de l'Ebre. Un lugar donde cada persona es bienvenida tal como es.",
  },
  redesSociales: {
    instagram: "https://instagram.com/iglesiabiblica",
    facebook: "https://facebook.com/iglesiabiblica",
    youtube: "https://youtube.com/@iglesiabiblica",
  },
  contacto: {
    direccion: "Calle Ejemplo 123\nTortosa, Tarragona 43500",
    telefono: "+34 600 000 000",
    email: "info@iglesiabiblica.es",
    horarioAtencion: "Lun–Vie, 9:00–17:00",
    googleMapsUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2987.123456789!2d0.5216!3d40.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTortosa%2C+Tarragona!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses",
  },
}

// Gallery images
export const mockGalleryImages = [
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop",
    alt: "Interior de la iglesia",
    span: "tall" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop",
    alt: "Biblia abierta",
    span: "normal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=800&auto=format&fit=crop",
    alt: "Momento de oración",
    span: "normal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    alt: "Grupo de vida reunido",
    span: "wide" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
    alt: "Familias en comunidad",
    span: "tall" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop",
    alt: "Servicio comunitario",
    span: "normal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop",
    alt: "Adoración",
    span: "normal" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop",
    alt: "Naturaleza y reflexión",
    span: "wide" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop",
    alt: "Interior de catedral",
    span: "tall" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop",
    alt: "Evento comunitario",
    span: "normal" as const,
  },
]

// Upcoming events
export const mockEventos = [
  {
    id: "1",
    nombre: "Retiro de Jóvenes",
    descripcion:
      "Un fin de semana de comunión, alabanza y crecimiento espiritual para jóvenes de 15 a 25 años.",
    fecha: getNextSaturday().toISOString(),
    horaInicio: "18:00",
    ubicacion: "Centro de Retiros Montcaro",
  },
  {
    id: "2",
    nombre: "Cena de Comunidad",
    descripcion:
      "Ven a compartir una cena especial con toda la familia de la iglesia. Trae un plato para compartir.",
    fecha: getNextFriday().toISOString(),
    horaInicio: "20:00",
    ubicacion: "Salón principal de la iglesia",
  },
  {
    id: "3",
    nombre: "Seminario Bíblico",
    descripcion:
      "Estudio profundo del libro de Romanos. Abierto para todos los que deseen crecer en el conocimiento de la Palabra.",
    fecha: getNextWednesday().toISOString(),
    horaInicio: "19:30",
    ubicacion: "Aula 2 de la iglesia",
  },
]

// Dashboard stats (for future admin reactivation)
export const mockStats = {
  articulos: 12,
  eventos: 5,
  imagenes: 24,
  videos: 8,
}

// Helper functions
function getNextSaturday(): Date {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
  const nextSaturday = new Date(today)
  nextSaturday.setDate(today.getDate() + daysUntilSaturday)
  nextSaturday.setHours(18, 0, 0, 0)
  return nextSaturday
}

function getNextFriday(): Date {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7
  const nextFriday = new Date(today)
  nextFriday.setDate(today.getDate() + daysUntilFriday)
  nextFriday.setHours(20, 0, 0, 0)
  return nextFriday
}

function getNextWednesday(): Date {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7
  const nextWednesday = new Date(today)
  nextWednesday.setDate(today.getDate() + daysUntilWednesday)
  nextWednesday.setHours(19, 30, 0, 0)
  return nextWednesday
}

/**
 * Get the next Sunday service date
 * Used for the countdown timer
 */
export function getNextSundayServiceDate(): Date {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7
  const nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + daysUntilSunday)
  nextSunday.setHours(11, 0, 0, 0)

  // If it's Sunday and the service hasn't started yet, use today
  if (dayOfWeek === 0) {
    const now = new Date()
    const serviceToday = new Date(now)
    serviceToday.setHours(11, 0, 0, 0)
    if (now < serviceToday) {
      return serviceToday
    }
  }

  return nextSunday
}

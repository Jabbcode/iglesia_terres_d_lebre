"use client"

import { useEffect, useState } from "react"
import {
  Church,
  HeartHandshake,
  Users,
  BookOpen,
  Smile,
  Calendar,
  type LucideIcon,
} from "lucide-react"

interface Horario {
  id: string
  titulo: string
  descripcion: string | null
  dia: string
  hora: string
  icono: string | null
}

const iconMap: Record<string, LucideIcon> = {
  Church,
  HeartHandshake,
  Users,
  BookOpen,
  Smile,
  Calendar,
}

const detailSections = [
  {
    title: "Estudio Bíblico",
    subtitle: "semanal",
    description:
      "Profundiza en las Escrituras con nosotros. Un tiempo para aprender y dialogar en un ambiente de hermandad.",
    emphasis: "¡Todos son bienvenidos!",
    icon: BookOpen,
    schedule: "Cada Miércoles a las 20:00h",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Estudio bíblico",
  },
  {
    title: "Actividades para",
    subtitle: "niños",
    description:
      "Durante el culto de adoración, los más pequeños disfrutan de un tiempo especial en la",
    emphasis: "Escuela Dominical,",
    afterEmphasis: " aprendiendo de la Biblia de forma divertida y creativa.",
    icon: Smile,
    schedule: "Domingos a las 11:00h",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Actividades para niños",
  },
]

export function Schedule() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/horarios")
      .then((res) => res.json())
      .then((data) => {
        setHorarios(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const getIcon = (iconName: string | null): LucideIcon => {
    if (iconName && iconMap[iconName]) {
      return iconMap[iconName]
    }
    return Calendar
  }

  if (loading) {
    return (
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-muted mx-auto h-8 w-48 animate-pulse rounded" />
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Header */}
      <section className="bg-cream pt-20 pb-6">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Nuestros{" "}
            <span className="text-amber font-serif italic">Horarios</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Únete a nuestra comunidad. Un espacio para{" "}
            <em className="text-amber not-italic">crecer en la fe</em>,
            compartir en <em className="text-amber not-italic">comunión</em> y
            adorar juntos.
          </p>
        </div>
      </section>

      {/* Schedule cards */}
      <section className="bg-cream pt-10 pb-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {horarios.map((horario) => {
            const Icon = getIcon(horario.icono)
            return (
              <div
                key={horario.id}
                className="border-border/50 rounded-2xl border bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                  <Icon className="text-amber size-9" strokeWidth={1.5} />
                </div>
                <h3 className="text-foreground mb-1 text-lg font-bold">
                  {horario.titulo}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {horario.dia}, {horario.hora}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Detail sections (alternating) */}
      <section className="bg-white">
        {detailSections.map((section, index) => {
          const isReversed = index % 2 !== 0
          return (
            <div
              key={section.title}
              className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
            >
              <div
                className={`flex flex-col items-center gap-10 lg:gap-16 ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Text */}
                <div className="flex-1">
                  <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                    {section.title}{" "}
                    <span className="text-amber font-serif italic">
                      {section.subtitle}
                    </span>
                  </h2>
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                    {section.description} <em>{section.emphasis}</em>
                    {section.afterEmphasis}
                  </p>
                  <div className="flex items-center gap-3">
                    <section.icon
                      className="text-amber size-5"
                      strokeWidth={1.5}
                    />
                    <span className="text-foreground text-sm font-semibold">
                      {section.schedule}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="bg-muted overflow-hidden rounded-2xl">
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}

"use client"

import { Target, Eye, Heart, Users, BookOpen, Play } from "lucide-react"
import { useState } from "react"

const missionVision = [
  {
    icon: Target,
    title: "Nuestra Misión",
    description:
      "Compartir el amor de Cristo con nuestra comunidad, formando discípulos que vivan y proclamen el evangelio, sirviendo a los demás con compasión y dedicación.",
  },
  {
    icon: Eye,
    title: "Nuestra Visión",
    description:
      "Ser una iglesia que transforma vidas y comunidades a través del poder del evangelio, donde cada persona encuentre su propósito en Cristo y crezca en fe, amor y servicio.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Amor",
    description:
      "Amamos a Dios sobre todas las cosas y a nuestro prójimo como a nosotros mismos.",
  },
  {
    icon: Users,
    title: "Comunidad",
    description:
      "Creemos en el poder de la comunidad y el compañerismo entre creyentes.",
  },
  {
    icon: BookOpen,
    title: "Palabra",
    description:
      "La Biblia es nuestra guía y autoridad en todo lo que hacemos y enseñamos.",
  },
]

// Mock de testimonios - se conectará con el admin posteriormente
const mockTestimonios = [
  {
    id: "1",
    nombre: "María García",
    descripcion:
      "Mi vida cambió completamente cuando conocí a Cristo en esta iglesia. Encontré una familia de fe que me apoya en todo momento.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
  },
  {
    id: "2",
    nombre: "Juan Martínez",
    descripcion:
      "Después de años buscando propósito, encontré en esta comunidad el amor y la guía que necesitaba para mi vida.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800",
  },
  {
    id: "3",
    nombre: "Ana López",
    descripcion:
      "Los estudios bíblicos y el compañerismo me han ayudado a crecer espiritualmente de maneras que nunca imaginé.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800",
  },
]

export function AboutUs() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pb-16 pt-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Conoce{" "}
            <span className="text-amber font-serif italic">Nuestra Iglesia</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Somos una comunidad de fe comprometida con el amor de Cristo.
            Descubre nuestra historia, misión y los valores que nos guían cada
            día.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="border-border border-t bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            {/* Image */}
            <div className="flex-1">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop"
                  alt="Interior de la iglesia"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
                NUESTRA HISTORIA
              </p>
              <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                Una comunidad de fe en{" "}
                <span className="text-amber font-serif italic">
                  Terres de l&apos;Ebre
                </span>
              </h2>
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <p>
                  Nuestra iglesia nació del deseo de crear un espacio donde las
                  personas pudieran encontrarse con Dios y crecer en comunidad.
                  Desde nuestros inicios, hemos estado comprometidos con
                  compartir el mensaje del evangelio y servir a nuestra
                  comunidad.
                </p>
                <p>
                  A lo largo de los años, hemos visto cómo Dios ha transformado
                  vidas, restaurado familias y fortalecido nuestra fe. Cada
                  testimonio es una prueba del amor y la gracia de Dios
                  trabajando en medio nuestro.
                </p>
                <p>
                  Hoy, continuamos con la misma pasión y compromiso, abriendo
                  nuestras puertas a todos los que buscan conocer a Cristo y
                  formar parte de una familia de fe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
              PROPÓSITO
            </p>
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              Lo que nos{" "}
              <span className="text-amber font-serif italic">mueve</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {missionVision.map((item) => (
              <div
                key={item.title}
                className="border-border/50 flex flex-col items-center rounded-2xl border bg-white p-8 text-center shadow-sm md:items-start md:text-left"
              >
                <div className="bg-amber/10 mb-4 flex size-14 items-center justify-center rounded-full">
                  <item.icon className="text-amber size-7" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-border border-t bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
              NUESTROS VALORES
            </p>
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              Los pilares de nuestra{" "}
              <span className="text-amber font-serif italic">fe</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="flex flex-col items-center text-center">
                <div className="bg-amber/10 mb-4 flex size-16 items-center justify-center rounded-full">
                  <value.icon className="text-amber size-7" />
                </div>
                <h3 className="text-foreground mb-2 font-serif text-lg font-bold italic">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
              TESTIMONIOS
            </p>
            <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
              Vidas{" "}
              <span className="text-amber font-serif italic">transformadas</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed">
              Escucha las historias de personas cuyas vidas han sido
              transformadas por el amor de Cristo en nuestra comunidad.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockTestimonios.map((testimonio) => (
              <div
                key={testimonio.id}
                className="border-border/50 group overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                {/* Video thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={testimonio.thumbnail}
                    alt={`Testimonio de ${testimonio.nombre}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                    <button
                      onClick={() => setActiveVideo(testimonio.videoUrl)}
                      className="bg-amber hover:bg-amber-dark flex size-16 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                    >
                      <Play className="ml-1 size-7" fill="currentColor" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-foreground mb-2 font-bold">
                    {testimonio.nombre}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {testimonio.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <span className="text-2xl">&times;</span>
            <span className="sr-only">Cerrar</span>
          </button>

          <div
            className="aspect-video w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={activeVideo}
              title="Video testimonio"
              className="h-full w-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

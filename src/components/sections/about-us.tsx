"use client"

import { Target, Eye, Heart, Users, BookOpen, Play } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { motion, AnimatePresence } from "framer-motion"
import { FadeInUp } from "@/components/ui/motion"
import { useIsMobile } from "@/hooks/use-media-query"

interface Testimonio {
  id: string
  nombre: string
  descripcion: string
  videoUrl: string
  thumbnail: string
}

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

// Convierte cualquier URL de YouTube al formato embed
function getYouTubeEmbedUrl(url: string): string {
  // Si ya es embed, retornar
  if (url.includes("/embed/")) return url

  // Extraer video ID de diferentes formatos de URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }

  return url
}

export function AboutUs() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loadingTestimonios, setLoadingTestimonios] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    fetch("/api/public/testimonios")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonios(data)
        }
      })
      .catch(() => setTestimonios([]))
      .finally(() => setLoadingTestimonios(false))
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Conoce{" "}
            <span className="text-amber font-serif italic">
              Nuestra Iglesia
            </span>
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
            {missionVision.map((item, index) => (
              <FadeInUp key={item.title} delay={index * 0.1}>
                <div className="border-border/50 flex h-full flex-col items-center rounded-2xl border bg-white p-8 text-center shadow-sm md:items-start md:text-left">
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
              </FadeInUp>
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
            {values.map((value, index) => (
              <FadeInUp key={value.title} delay={index * 0.1}>
                <div className="flex flex-col items-center text-center">
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
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      {(loadingTestimonios || testimonios.length > 0) && (
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
                TESTIMONIOS
              </p>
              <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                Vidas{" "}
                <span className="text-amber font-serif italic">
                  transformadas
                </span>
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed">
                Escucha las historias de personas cuyas vidas han sido
                transformadas por el amor de Cristo en nuestra comunidad.
              </p>
            </div>

            {loadingTestimonios ? (
              <div className="flex justify-center gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full max-w-sm animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
                  >
                    <div className="aspect-video bg-gray-200" />
                    <div className="space-y-2 p-5">
                      <div className="h-5 w-32 rounded bg-gray-200" />
                      <div className="h-4 w-full rounded bg-gray-200" />
                      <div className="h-4 w-3/4 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                isMobile ? testimonios.length <= 1 : testimonios.length <= 3
              ) ? (
              <div className="flex flex-wrap justify-center gap-6">
                {testimonios.map((testimonio) => (
                  <div
                    key={testimonio.id}
                    className="border-border/50 group w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-sm"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={testimonio.thumbnail}
                        alt={`Testimonio de ${testimonio.nombre}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                        <button
                          onClick={() =>
                            setActiveVideo(
                              getYouTubeEmbedUrl(testimonio.videoUrl)
                            )
                          }
                          className="bg-amber hover:bg-amber-dark flex size-16 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                        >
                          <Play className="ml-1 size-7" fill="currentColor" />
                        </button>
                      </div>
                    </div>
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
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: true,
                  }),
                ]}
                className="w-full"
              >
                {/* Contenedor con espacio para flechas en desktop */}
                <div className="relative md:px-12">
                  <CarouselContent className="-ml-4">
                    {testimonios.map((testimonio) => (
                      <CarouselItem
                        key={testimonio.id}
                        className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                      >
                        <div className="border-border/50 group overflow-hidden rounded-2xl border bg-white shadow-sm">
                          <div className="relative aspect-video">
                            <img
                              src={testimonio.thumbnail}
                              alt={`Testimonio de ${testimonio.nombre}`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                              <button
                                onClick={() =>
                                  setActiveVideo(
                                    getYouTubeEmbedUrl(testimonio.videoUrl)
                                  )
                                }
                                className="bg-amber hover:bg-amber-dark flex size-16 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                              >
                                <Play
                                  className="ml-1 size-7"
                                  fill="currentColor"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="text-foreground mb-2 font-bold">
                              {testimonio.nombre}
                            </h3>
                            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                              {testimonio.descripcion}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* Flechas a los lados en desktop */}
                  <CarouselPrevious className="absolute top-1/2 -left-1 hidden -translate-y-1/2 md:flex" />
                  <CarouselNext className="absolute top-1/2 -right-1 hidden -translate-y-1/2 md:flex" />
                </div>
                {/* Flechas centradas en móvil */}
                <div className="mt-6 flex justify-center gap-4 md:hidden">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            )}
          </div>
        </section>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <span className="text-2xl">&times;</span>
              <span className="sr-only">Cerrar</span>
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

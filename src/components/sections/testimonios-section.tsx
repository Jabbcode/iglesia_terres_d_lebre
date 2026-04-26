"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { VideoModal } from "@/components/ui/video-modal"
import { useIsMobile } from "@/hooks/use-media-query"
import { api } from "@/shared/api"
import type { Testimonio } from "@/modules/testimonios"

function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("/embed/")) return url

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }

  return url
}

interface TestimonioCardProps {
  testimonio: Testimonio
  onPlay: (embedUrl: string) => void
  className?: string
}

function TestimonioCard({
  testimonio,
  onPlay,
  className,
}: TestimonioCardProps) {
  return (
    <div
      className={cn(
        "border-border/50 group overflow-hidden rounded-2xl border bg-white shadow-sm",
        className
      )}
    >
      <div className="relative aspect-video">
        <img
          src={testimonio.thumbnail}
          alt={`Testimonio de ${testimonio.nombre}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <button
            onClick={() => onPlay(getYouTubeEmbedUrl(testimonio.videoUrl))}
            className="bg-amber hover:bg-amber-dark flex size-16 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
          >
            <Play className="ml-1 size-7" fill="currentColor" />
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-foreground mb-2 font-bold">{testimonio.nombre}</h3>
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {testimonio.descripcion}
        </p>
      </div>
    </div>
  )
}

function TestimoniosSkeleton() {
  return (
    <div className="flex justify-center gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-full max-w-sm animate-pulse overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
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
  )
}

export function TestimoniosSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    api
      .get<Testimonio[]>("/api/public/testimonios")
      .then(setTestimonios)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && testimonios.length === 0) return null

  return (
    <>
      <section className="border-border bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-amber mb-3 text-xs font-bold tracking-widest uppercase">
              Testimonios
            </p>
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              Vidas transformadas
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed">
              Escucha las historias de personas cuyas vidas han sido
              transformadas por el amor de Cristo en nuestra comunidad.
            </p>
          </div>

          {loading ? (
            <TestimoniosSkeleton />
          ) : isMobile ? (
            testimonios.length <= 1
          ) : testimonios.length <= 3 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {testimonios.map((testimonio) => (
                <TestimonioCard
                  key={testimonio.id}
                  testimonio={testimonio}
                  onPlay={setActiveVideo}
                  className="w-full max-w-sm"
                />
              ))}
            </div>
          ) : (
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
              className="w-full"
            >
              <div className="relative md:px-12">
                <CarouselContent className="-ml-4">
                  {testimonios.map((testimonio) => (
                    <CarouselItem
                      key={testimonio.id}
                      className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                    >
                      <TestimonioCard
                        testimonio={testimonio}
                        onPlay={setActiveVideo}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 -left-1 hidden -translate-y-1/2 md:flex" />
                <CarouselNext className="absolute top-1/2 -right-1 hidden -translate-y-1/2 md:flex" />
              </div>
              <div className="mt-6 flex justify-center gap-4 md:hidden">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          )}
        </div>
      </section>

      <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  )
}

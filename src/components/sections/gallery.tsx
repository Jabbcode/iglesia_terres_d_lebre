"use client";

import { useEffect, useState } from "react";
import { Instagram, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Imagen {
  id: string;
  src: string;
  alt: string;
  span: string | null;
}

export function Gallery() {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/public/galeria")
      .then((res) => res.json())
      .then((data) => {
        setImagenes(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-cream pb-6 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-center text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Nuestra vida en{" "}
            <span className="font-serif italic text-amber">Comunidad</span>
          </h1>
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
            Explora los momentos que hemos compartido. Cada imagen y video es un
            testimonio de{" "}
            <em>nuestra fe, alegría y comunión</em>.
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="bg-cream pb-10 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {imagenes.map((image, index) => (
              <div
                key={index}
                className="mb-4 break-inside-avoid"
              >
                <button
                  onClick={() => setLightbox(index)}
                  className="group relative block w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      image.span === "tall"
                        ? "aspect-[3/4]"
                        : image.span === "wide"
                          ? "aspect-[4/3]"
                          : "aspect-square"
                    }`}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="p-4 text-sm font-medium text-white">
                      {image.alt}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="bg-cream pb-20 pt-6">
        <div className="flex justify-center">
          <Button
            asChild
            className="h-12 gap-2 rounded-full bg-amber px-8 text-sm font-bold tracking-wider text-white hover:bg-amber-dark"
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="size-4" />
              Ver más en Instagram
            </a>
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
            <span className="sr-only">Cerrar</span>
          </button>

          <img
            src={imagenes[lightbox].src.replace("w=800", "w=1600")}
            alt={imagenes[lightbox].alt}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox === 0 ? imagenes.length - 1 : lightbox - 1
              );
            }}
            className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
          >
            &#8249;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox === imagenes.length - 1 ? 0 : lightbox + 1
              );
            }}
            className="absolute right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}

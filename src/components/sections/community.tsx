"use client"

import { useState, useEffect } from "react"

interface TarjetaComunidad {
  id: string
  titulo: string
  descripcion: string
  imagen: string
  linkHref: string | null
  linkLabel: string | null
}

export function Community() {
  const [cards, setCards] = useState<TarjetaComunidad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/comunidad")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCards(data)
        }
      })
      .catch(() => {
        // Handle error silently
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="mx-auto mb-3 h-4 w-24 rounded bg-gray-200" />
              <div className="mx-auto mb-4 h-10 w-64 rounded bg-gray-200" />
              <div className="mx-auto mb-6 h-1 w-16 rounded bg-gray-200" />
              <div className="mx-auto h-16 w-full max-w-md rounded bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (cards.length === 0) {
    return null
  }

  return (
    <section
      id="comunidad"
      aria-labelledby="community-heading"
      className="pt-20 pb-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
            VIDA DE IGLESIA
          </p>
          <h2
            id="community-heading"
            className="text-foreground mb-4 text-3xl font-bold sm:text-4xl"
          >
            Nuestra Comunidad
          </h2>
          <div className="bg-amber mx-auto mb-6 h-1 w-16 rounded-full" />
          <p className="text-muted-foreground text-base leading-relaxed">
            En nuestra iglesia encontrarás un lugar donde ser parte de algo más
            grande. Descubre las diferentes formas en que puedes conectar,
            crecer y servir junto a nosotros.
          </p>
        </div>
      </div>
    </section>
  )
}

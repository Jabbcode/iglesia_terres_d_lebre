"use client"

export function Community() {
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

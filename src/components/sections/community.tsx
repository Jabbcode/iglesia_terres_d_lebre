import Link from "next/link"
import { ArrowRight } from "lucide-react"

const communityCards = [
  {
    title: "Grupos de Vida",
    description:
      "Conecta con otros creyentes en grupos pequeños donde podrás crecer espiritualmente, compartir y ser edificado.",
    link: { href: "#grupos", label: "VER GRUPOS" },
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop",
  },
  {
    title: "Familias",
    description:
      "Nuestros programas para familias y niños buscan formar la próxima generación en los valores del reino de Dios.",
    link: { href: "#familias", label: "MINISTERIO KIDS" },
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2940&auto=format&fit=crop",
  },
  {
    title: "Impacto Social",
    description:
      "Creemos que la fe se vive sirviendo. Descubre cómo estamos transformando nuestra comunidad y cómo puedes ser parte.",
    link: { href: "#impacto", label: "INVOLÚCRATE" },
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2874&auto=format&fit=crop",
  },
]

export function Community() {
  return (
    <section
      id="comunidad"
      aria-labelledby="community-heading"
      className="py-20"
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

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communityCards.map((card) => (
            <article
              key={card.title}
              className="group relative h-96 overflow-hidden rounded-2xl"
            >
              {/* Background image */}
              <figure
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${card.image}')` }}
                role="img"
                aria-label={card.title}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                aria-hidden="true"
              />

              {/* Content with glassmorphism */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/80">
                    {card.description}
                  </p>
                  <Link
                    href={card.link.href}
                    className="text-amber inline-flex items-center gap-2 text-xs font-bold tracking-wider transition-colors hover:text-white"
                  >
                    {card.link.label}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

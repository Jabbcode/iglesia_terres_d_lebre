"use client"

import { useState } from "react"
import {
  BookOpen,
  Triangle,
  Users,
  Church,
  Cross,
  Flame,
  Gift,
  Sunset,
  Wine,
  Heart,
  CloudSun,
  type LucideIcon,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { FadeInUp } from "@/components/ui/motion"
import { useIsMobile } from "@/hooks/use-media-query"

interface Creencia {
  id: string
  icon: LucideIcon
  title: string
  subtitle?: string
  shortDescription: string
  longDescription: string
  image: string
  imageAlt: string
  mostrarDetalle: boolean
}

const creencias: Creencia[] = [
  {
    id: "biblia",
    icon: BookOpen,
    title: "La Biblia",
    subtitle: "Nuestra base",
    shortDescription: "Nuestra base",
    longDescription:
      "Creemos que la Biblia es el mensaje de Dios para la humanidad. Tanto el Antiguo como el Nuevo Testamento fueron inspirados por Él y no contienen errores en sus escritos originales. Es la revelación completa de Su voluntad para salvarnos y la autoridad final que guía nuestra vida, nuestra fe y nuestra conducta. Por eso, creemos que su mensaje está cerrado: no se le puede quitar ni añadir nada.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/biblia.jpeg",
    imageAlt: "Biblia abierta",
    mostrarDetalle: true,
  },
  {
    id: "trinidad",
    icon: Triangle,
    title: "Dios",
    subtitle: "Uno en tres personas",
    shortDescription: "Padre, Hijo y Espíritu Santo",
    longDescription:
      "Creemos en un solo Dios eterno que existe en tres personas: el Padre, el Hijo y el Espíritu Santo. Aunque son tres, son un solo Dios con la misma naturaleza, los mismos atributos y la misma perfección. Por lo tanto, los tres merecen el mismo respeto, confianza y obediencia de nuestra parte.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/dios.jpg",
    imageAlt: "Luz divina",
    mostrarDetalle: true,
  },
  {
    id: "jesucristo",
    icon: Cross,
    title: "Jesucristo",
    subtitle: "Dios hecho hombre",
    shortDescription: "Plenamente Dios y hombre",
    longDescription:
      "Creemos que Jesucristo es plenamente Dios y plenamente hombre a la vez. Él ya existía desde siempre como Dios, pero se hizo hombre al ser concebido por el Espíritu Santo y nacer de una virgen, sin dejar de ser divino. Murió en la cruz como el sacrificio perfecto en nuestro lugar, resucitó al tercer día y ascendió al cielo. Hoy, desde allí, actúa como nuestro defensor y representante ante Dios mientras esperamos Su regreso.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/jesus.jpg",
    imageAlt: "Cruz al atardecer",
    mostrarDetalle: true,
  },
  {
    id: "espiritu-santo",
    icon: Flame,
    title: "El Espíritu Santo",
    subtitle: "Nuestra guía",
    shortDescription: "Mora en los creyentes",
    longDescription:
      "Creemos que el Espíritu Santo es la tercera persona de la Trinidad. Su labor es darle la gloria a Jesús y ayudar a las personas a reconocer su pecado y su necesidad de Dios. Cuando alguien confía en Jesús, el Espíritu lo transforma y lo une a la Iglesia en ese mismo instante. Además, vive en el creyente para guiarlo, enseñarle y darle las fuerzas para vivir una vida que agrade a Dios.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/espiritu_santo.jpg",
    imageAlt: "Luz y espiritualidad",
    mostrarDetalle: true,
  },
  {
    id: "salvacion",
    icon: Gift,
    title: "La Salvación",
    subtitle: "Un regalo eterno",
    shortDescription: "Por gracia mediante la fe",
    longDescription:
      "Creemos que cuando alguien confía en el Señor Jesucristo y en Su obra, pasa de inmediato de la muerte espiritual a la vida. En ese momento, Dios lo acepta y lo declara <em><strong>justo</strong></em>, tal como acepta a Jesús mismo. Esta unión con Cristo es para siempre. Somos salvos únicamente por Su sacrificio en la cruz. Al creer, somos <em><strong>nacidos de nuevo</strong></em> y sellados por el Espíritu Santo, confiando en que Dios siempre cumple Sus promesas.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/salvacion.jpg",
    imageAlt: "Luz de esperanza",
    mostrarDetalle: true,
  },
  {
    id: "humanidad",
    icon: Users,
    title: "El Ser Humano",
    subtitle: "Nuestra condición",
    shortDescription: "Creado a imagen de Dios",
    longDescription:
      "Creemos que fuimos creados a imagen de Dios, pero el pecado nos separó de Él. Como resultado, la humanidad perdió su conexión espiritual con Dios y quedó bajo una <em><strong>depravación total</strong></em>, lo que significa que estamos espiritualmente incapacitados para salvarnos por nosotros mismos. Esta condición se transmite a toda la raza humana, siendo Jesucristo la única excepción.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/ser_humano_1.jpg",
    imageAlt: "Comunidad de personas",
    mostrarDetalle: true,
  },
  {
    id: "regreso-cristo",
    icon: Sunset,
    title: "El Regreso de Cristo",
    subtitle: "Nuestra esperanza",
    shortDescription: "Segunda venida de Cristo",
    longDescription:
      "Creemos que después de un tiempo de gran dificultad en el mundo (la gran tribulación), el Señor Jesucristo regresará de forma física y personal. Vendrá con todo Su poder y gloria para establecer Su reino de mil años (el Milenio), derrotar el mal, restaurar la Creación de su actual sufrimiento, cumplir Sus promesas con Israel y ser reconocido por todo el mundo como Dios.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/regreso_cristo.jpg",
    imageAlt: "Regreso de Cristo",
    mostrarDetalle: true,
  },
  {
    id: "resurreccion",
    icon: CloudSun,
    title: "La Resurrección",
    subtitle: "El futuro eterno",
    shortDescription: "El futuro eterno",
    longDescription:
      "Creemos que todas las personas que han muerto volverán a vivir físicamente. Quienes confiaron en Dios resucitarán para vivir en una alegría eterna junto a Él. Por otro lado, quienes rechazaron Su amor resucitarán para enfrentar un juicio y una separación consciente y eterna de Dios.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/resureccion.jpg",
    imageAlt: "Resurrección de los muertos",
    mostrarDetalle: true,
  },
  {
    id: "iglesia",
    icon: Church,
    title: "La Iglesia",
    subtitle: "Una familia unida",
    shortDescription: "El cuerpo de Cristo",
    longDescription:
      "Creemos que la Iglesia no es un lugar, sino la unión de todas las personas que han sido transformadas por el Espíritu Santo mediante la fe. En el momento en que alguien recibe a Cristo en su corazón, pasa a formar parte de esta gran familia espiritual que llamamos la 'iglesia universal'.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/iglesia.png",
    imageAlt: "Iglesia reunida",
    mostrarDetalle: true,
  },
  {
    id: "bautismo-santa-cena",
    icon: Wine,
    title: "El Bautismo",
    subtitle: "y la Santa Cena",
    shortDescription: "Bautismo y Santa Cena",
    longDescription:
      "Creemos que Jesús nos dejó dos ceremonias especiales: el Bautismo en agua y la Santa Cena. Queremos ser claros: participar en ellas no nos salva, pero son medios muy importantes para dar testimonio público de nuestra fe y recordar el sacrificio de Jesús por nosotros.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/bautismo.jpeg",
    imageAlt: "Bautismo y Santa Cena",
    mostrarDetalle: true,
  },
  {
    id: "estilo-vida-cristiana",
    icon: Heart,
    title: "Una vida santa",
    subtitle: "El estilo de vida cristiano",
    shortDescription: "El Estilo de Vida Cristiano",
    longDescription:
      "Creemos que hemos sido llamados a vivir de una manera santa, guiados por el Espíritu de Dios y no por nuestros impulsos egoístas. Aunque mientras estemos en este mundo seguiremos luchando con nuestra naturaleza humana (la carne), nuestra meta es someter cada área de nuestra vida al control de Cristo con la ayuda del Espíritu Santo.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/vida_santa.jpg",
    imageAlt: "Vida cristiana",
    mostrarDetalle: true,
  },
]

export function Beliefs() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const creenciasConDetalle = creencias.filter((c) => c.mostrarDetalle)

  const handleCardClick = (id: string) => {
    const creencia = creencias.find((c) => c.id === id)
    if (creencia?.mostrarDetalle) {
      setSelectedId(id)
      // Scroll to detail section
      const element = document.getElementById(`creencia-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  return (
    <>
      {/* Header */}
      <section className="bg-cream pt-20 pb-6">
        <FadeInUp>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              En qué{" "}
              <span className="text-amber font-serif italic">Creemos</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              Fundamentamos nuestra fe en la <em>Palabra de Dios</em>. Creemos
              en un único Dios, creador del universo, manifestado en tres
              personas: <em>Padre, Hijo y Espíritu Santo</em>.
            </p>
          </div>
        </FadeInUp>
      </section>

      {/* Belief cards */}
      <section className="bg-cream pt-10 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(isMobile ? creencias.length <= 1 : creencias.length <= 4) ? (
            <div className="flex flex-wrap justify-center gap-5">
              {creencias.map((creencia) => {
                const Icon = creencia.icon
                return (
                  <button
                    key={creencia.id}
                    onClick={() => handleCardClick(creencia.id)}
                    className={`border-border/50 w-full max-w-[280px] rounded-2xl border bg-white p-8 text-center shadow-sm transition-all hover:shadow-md ${
                      creencia.mostrarDetalle
                        ? "cursor-pointer hover:-translate-y-1"
                        : "cursor-default"
                    } ${
                      selectedId === creencia.id
                        ? "ring-amber ring-2 ring-offset-2"
                        : ""
                    }`}
                  >
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                      <Icon className="text-amber size-9" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-foreground mb-1 text-lg font-bold">
                      {creencia.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {creencia.shortDescription}
                    </p>
                  </button>
                )
              })}
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
              <div className="relative md:px-12">
                <CarouselContent className="mx-2 -ml-2">
                  {creencias.map((creencia) => {
                    const Icon = creencia.icon
                    return (
                      <CarouselItem
                        key={creencia.id}
                        className="basis-full py-4 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <button
                          onClick={() => handleCardClick(creencia.id)}
                          className={`border-border/50 w-full rounded-2xl border bg-white p-8 text-center shadow-sm transition-all hover:shadow-md ${
                            creencia.mostrarDetalle
                              ? "cursor-pointer hover:-translate-y-1"
                              : "cursor-default"
                          } ${
                            selectedId === creencia.id
                              ? "ring-amber ring-2 ring-offset-2"
                              : ""
                          }`}
                        >
                          <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                            <Icon
                              className="text-amber size-9"
                              strokeWidth={1.5}
                            />
                          </div>
                          <h3 className="text-foreground mb-1 text-lg font-bold">
                            {creencia.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {creencia.shortDescription}
                          </p>
                        </button>
                      </CarouselItem>
                    )
                  })}
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

      {/* Detail sections (alternating layout like horarios) */}
      {creenciasConDetalle.length > 0 && (
        <section className="bg-white">
          {creenciasConDetalle.map((creencia, index) => {
            const isReversed = index % 2 !== 0
            const Icon = creencia.icon
            return (
              <div
                key={creencia.id}
                id={`creencia-${creencia.id}`}
                className={`mx-auto max-w-7xl px-4 py-8 transition-all duration-300 sm:py-8 lg:px-8 lg:py-12`}
              >
                <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
                  {/* Text */}
                  <div
                    className={`flex-1 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                      {creencia.title}{" "}
                      {creencia.subtitle && (
                        <span className="text-amber font-serif italic">
                          {creencia.subtitle}
                        </span>
                      )}
                    </h2>
                    <p
                      className="text-muted-foreground mb-6 text-base leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: creencia.longDescription,
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <Icon className="text-amber size-5" strokeWidth={1.5} />
                      <span className="text-foreground text-sm font-semibold">
                        {creencia.shortDescription}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div
                    className={`w-full max-w-sm lg:max-w-md ${isReversed ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="bg-muted overflow-hidden rounded-2xl">
                      <img
                        src={creencia.image}
                        alt={creencia.imageAlt}
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
      )}
    </>
  )
}

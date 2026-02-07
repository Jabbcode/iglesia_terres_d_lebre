import {
  BookOpen,
  Triangle,
  Users,
  Church,
  Clock,
  CalendarCheck,
  Target,
  Eye,
} from "lucide-react";

const topCards = [
  {
    icon: BookOpen,
    title: "La Biblia",
    description:
      "Es la Palabra inspirada de Dios, infalible y autoritativa en todos los asuntos de fe y vida.",
  },
  {
    icon: Triangle,
    title: "Dios Trino",
    description:
      "Creemos en un solo Dios, eterno, que existe en tres personas: Padre, Hijo y Espíritu Santo, creador y sustentador de todo.",
  },
  {
    icon: Users,
    title: "El Ser Humano y el Pecado",
    description:
      "El ser humano fue creado a imagen de Dios, pero cayó en pecado, lo que resultó en separación de Dios.",
  },
];

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
];

const alternatingBeliefs = [
  {
    title: "Jesucristo,",
    subtitle: "nuestro Salvador",
    description:
      "Creemos que Jesucristo, el Hijo de Dios, es plenamente Dios y plenamente hombre. Nació de una virgen, vivió una vida sin pecado, murió en la cruz por nuestros pecados, resucitó al tercer día, ascendió al cielo y vendrá otra vez en gloria.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Biblia abierta con cruz",
  },
  {
    title: "El Espíritu Santo,",
    subtitle: "nuestro Consolador",
    description:
      "Creemos en el Espíritu Santo, que convence al mundo de pecado, regenera a los creyentes, mora en ellos, los sella para el día de la redención, y los capacita para vivir una vida santa y de servicio.",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz y espiritualidad",
  },
  {
    title: "La Salvación,",
    subtitle: "un regalo de Dios",
    description:
      "La salvación es un don de Dios, recibido por gracia mediante la fe en Jesucristo. No se basa en méritos humanos, sino en el sacrificio de Cristo. La fe genuina se manifiesta en obras de obediencia.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz de esperanza",
  },
];

const bottomCards = [
  {
    icon: Church,
    title: "La Iglesia",
    description:
      "El cuerpo de Cristo, la comunidad de los creyentes, llamada a adorar a Dios, edificarse mutuamente y compartir el evangelio.",
  },
  {
    icon: Clock,
    title: "El Futuro",
    description:
      "Creemos en la segunda venida de Cristo, la resurrección de los muertos, el juicio final y la vida eterna con Dios.",
  },
  {
    icon: CalendarCheck,
    title: "Las Ordenanzas",
    description:
      "Practicamos el Bautismo del creyente por inmersión y la Cena del Señor como símbolos de nuestra fe y comunión.",
  },
];

function IconCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-amber/10">
        <Icon className="size-7 text-amber" />
      </div>
      <h3 className="mb-2 font-serif text-lg font-bold italic text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function Beliefs() {
  return (
    <>
      {/* Hero header */}
      <section className="bg-cream pb-16 pt-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            En que{" "}
            <span className="font-serif italic text-amber">Creemos</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Fundamentamos nuestra fe en la{" "}
            <em>Palabra de Dios</em>. Creemos en un único Dios, creador del
            universo, manifestado en tres personas:{" "}
            <em>Padre, Hijo y Espíritu Santo</em>.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-t border-border bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {missionVision.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-2xl border border-border/50 bg-cream p-8 text-center shadow-sm md:items-start md:text-left"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber/10">
                  <item.icon className="size-7 text-amber" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 3 icon cards */}
      <section className="bg-cream py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {topCards.map((card) => (
            <IconCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* Alternating belief sections */}
      <section className="bg-white">
        {alternatingBeliefs.map((belief, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <div
              key={belief.title}
              className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
            >
              <div
                className={`flex flex-col items-center gap-8 lg:gap-12 ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
                    {belief.title}{" "}
                    <span className="font-serif italic text-amber">
                      {belief.subtitle}
                    </span>
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {belief.description}
                  </p>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={belief.image}
                      alt={belief.imageAlt}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom 3 icon cards */}
      <section className="border-t border-border bg-cream py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {bottomCards.map((card) => (
            <IconCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </>
  );
}

import {
  Church,
  HeartHandshake,
  Users,
  BookOpen,
  Smile,
} from "lucide-react";

const scheduleCards = [
  {
    icon: Church,
    title: "Culto de Adoración",
    time: "Domingos, 11:00h",
  },
  {
    icon: HeartHandshake,
    title: "Reunión de Oración",
    time: "Miércoles, 20:00h",
  },
  {
    icon: Users,
    title: "Reunión de Jóvenes",
    time: "Sábados, 18:00h",
  },
];

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
    afterEmphasis:
      " aprendiendo de la Biblia de forma divertida y creativa.",
    icon: Smile,
    schedule: "Domingos a las 11:00h",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Actividades para niños",
  },
];

export function Schedule() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream pb-6 pt-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Nuestros{" "}
            <span className="font-serif italic text-amber">Horarios</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Únete a nuestra comunidad. Un espacio para{" "}
            <em className="not-italic text-amber">crecer en la fe</em>,
            compartir en{" "}
            <em className="not-italic text-amber">comunión</em> y adorar
            juntos.
          </p>
        </div>
      </section>

      {/* Schedule cards */}
      <section className="bg-cream pb-16 pt-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {scheduleCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border/50 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                <card.icon className="size-9 text-amber" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1 text-lg font-bold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">{card.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detail sections (alternating) */}
      <section className="bg-white">
        {detailSections.map((section, index) => {
          const isReversed = index % 2 !== 0;
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
                  <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
                    {section.title}{" "}
                    <span className="font-serif italic text-amber">
                      {section.subtitle}
                    </span>
                  </h2>
                  <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                    {section.description}{" "}
                    <em>{section.emphasis}</em>
                    {section.afterEmphasis}
                  </p>
                  <div className="flex items-center gap-3">
                    <section.icon
                      className="size-5 text-amber"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      {section.schedule}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="overflow-hidden rounded-2xl bg-muted">
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
          );
        })}
      </section>
    </>
  );
}

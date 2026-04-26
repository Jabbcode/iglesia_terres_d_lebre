"use client"

import { Target, Eye, Heart, Users, BookOpen } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FadeInUp } from "@/components/ui/motion"
import { TestimoniosSection } from "@/components/sections/testimonios-section"
import { LeaderCard } from "@/components/sections/leader-card"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

interface AboutUsProps {
  lang: Locale
  dict: Dictionary
}

const missionVision = [
  {
    icon: Target,
    title: "Misión",
    description:
      "Guiar a cada persona a una relación profunda con Dios, fundamentada en Su Palabra y apoyada por una comunidad que camina en amor.",
  },
  {
    icon: Eye,
    title: "Visión",
    description:
      "Consolidarnos como una familia de fe donde cada miembro crezca espiritualmente y sirva al prójimo con integridad.",
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

const leadership = [
  {
    name: "Andrés Molina",
    role: "Pastor",
    description:
      "Graduado en Teología Pastoral tras cuatro años en el seminario SEFOVAN, cuenta con la certificación oficial internacional del Southwestern Baptist Theological Seminary (Dallas, Texas). Tras servir en varias iglesias de Barcelona, se trasladó a Xerta, donde durante la pandemia inició reuniones de oración en su hogar ante la falta de una comunidad de base bíblica. Lo que comenzó con familiares y vecinos creció hasta establecerse en un local en Tortosa. Hoy, en este 2026, continúa guiando a la congregación con amor, compromiso y dedicación.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/nosotros/pastor.jpg",
  },
]

export function AboutUs({ lang, dict }: AboutUsProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // Construir missionVision desde el diccionario
  const missionVisionFromDict = [
    {
      icon: Target,
      title: dict.about.purpose.mission.title,
      description: dict.about.purpose.mission.description,
    },
    {
      icon: Eye,
      title: dict.about.purpose.vision.title,
      description: dict.about.purpose.vision.description,
    },
  ]

  // Construir values desde el diccionario
  const valuesFromDict = dict.about.values.items.map((item, index) => ({
    icon: [Heart, Users, BookOpen][index],
    title: item.title,
    description: item.description,
  }))

  // Construir leadership desde el diccionario
  const leadershipFromDict = dict.about.leadership.items.map((item) => ({
    name: item.name,
    role: item.role,
    description: item.description,
    image: "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/nosotros/pastor.jpg",
  }))

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isDesktop ? ["-30%", "30%"] : ["0%", "0%"]
  )

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {dict.about.pageTitle}{" "}
            <span className="text-amber font-serif italic">
              {dict.about.pageTitleEmphasis}
            </span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            {dict.about.pageDescription}
          </p>
        </div>
      </section>

      {/* Historia Section 1 - Image Left */}
      <section className="border-border border-t bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Image with Frame Effect */}
            <div className="flex-1">
              <div className="relative">
                {/* Decorative circle */}
                <div className="bg-amber/20 absolute -top-8 -left-8 size-24 rounded-full" />

                {/* Frame with image */}
                <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-xl">
                  <img
                    src="https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/nosotros/nosotros_principal.png"
                    alt="Edificio histórico de la iglesia"
                    className="h-auto w-full rounded object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold sm:text-4xl">
                {dict.about.history.past.title}{" "}
                <span className="text-amber font-serif italic">
                  {dict.about.history.past.titleEmphasis}
                </span>
              </h2>
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <p>
                  {dict.about.history.past.content1}
                </p>
                <p className="text-amber mb-3 text-xs font-bold tracking-widest uppercase">
                  {dict.about.history.past.badge1}
                </p>
                <p>
                  {dict.about.history.past.content2}
                </p>
                <p className="text-amber mb-3 text-xs font-bold tracking-widest uppercase">
                  {dict.about.history.past.badge2}
                </p>
                <p>
                  {dict.about.history.past.content3}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia Section 2 - Image Right with Multiple Photos */}
      <section className="border-border border-t bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse items-center gap-6 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold sm:text-4xl">
                {dict.about.history.present.title}{" "}
                <span className="text-amber font-serif italic">
                  {dict.about.history.present.titleEmphasis}
                </span>
              </h2>
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <p>
                  {dict.about.history.present.content}
                </p>
              </div>
            </div>

            {/* Images with Rotation and Overlay */}
            <div className="flex-1">
              <div className="relative h-auto lg:h-[500px]">
                {/* Large image below, overlapping */}
                <div className="lg:absolute lg:right-0 lg:bottom-0 w-full lg:w-[85%] lg:rotate-4 overflow-hidden rounded-lg shadow-xl">
                  <img
                    src="https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/nosotros/nosotros_presente_inferior.jpg"
                    alt="Iglesia"
                    className="h-auto lg:h-96 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia Section 3 - Full Width Image with Text Overlay */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Large Image */}
            <div className="flex-1">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/nosotros/nosotros_futuro.jpg"
                  alt="Amanecer esperanzador"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold sm:text-4xl">
                {dict.about.history.future.title}{" "}
                <span className="text-amber font-serif italic">
                  {dict.about.history.future.titleEmphasis}
                </span>
              </h2>
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <p>
                  {dict.about.history.future.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={parallaxRef}
        className="relative overflow-hidden py-64 md:py-80"
      >
        {/* Background Image with Parallax */}
        <div className="absolute inset-0">
          <motion.div
            style={isDesktop ? { y } : {}}
            className="absolute inset-0 w-full h-full lg:h-[150%] lg:-top-[5%]"
          >
            <img
              src="https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/nosotros/fondo_tortosa_roquetes.jpg"
              alt="Fondo Tortosa"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="max-w-8xl relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="font-serif text-3xl text-white italic sm:text-4xl lg:text-5xl">
              {dict.about.history.parallaxQuote}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-amber mb-3 text-xs font-bold tracking-widest uppercase">
              {dict.about.purpose.badge}
            </p>
            <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
              {dict.about.purpose.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {missionVisionFromDict.map((item, index) => (
              <FadeInUp key={item.title} delay={index * 0.1}>
                <div className="flex h-full flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm">
                  <div className="bg-amber/10 mb-6 flex size-16 items-center justify-center rounded-full">
                    <item.icon className="text-amber size-8" />
                  </div>
                  <h3 className="text-foreground mb-4 text-2xl font-bold">
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

      {/* Leadership Section */}
      <section className="border-border border-t bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              {dict.about.leadership.title}
            </h2>
            <div className="bg-amber mx-auto h-1 w-20" />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {leadershipFromDict.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </div>
        </div>
      </section>

      <TestimoniosSection lang={lang} dict={dict} />

      {/* Values */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-amber mb-3 text-xs font-bold tracking-widest uppercase">
              {dict.about.values.badge}
            </p>
            <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
              {dict.about.values.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {valuesFromDict.map((value, index) => (
              <FadeInUp key={value.title} delay={index * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber/10 mb-6 flex size-20 items-center justify-center rounded-full">
                    <value.icon className="text-amber size-9" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-bold">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

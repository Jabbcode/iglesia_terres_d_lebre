"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion, Variants } from "framer-motion"
import { useConfigStore } from "@/stores/config-store"
import { useEffect, useState, useRef } from "react"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

interface HeroProps {
  lang: Locale
  dict: Dictionary
}

export function Hero({ lang, dict }: HeroProps) {
  const shouldReduceMotion = useReducedMotion()
  const { config, fetchConfig } = useConfigStore()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const handler = () => setVideoLoaded(true)
    videoEl.addEventListener("canplaythrough", handler)

    return () => videoEl.removeEventListener("canplaythrough", handler)
  }, [config?.videoHero])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black"
    >
      {/* Background video */}
      {config?.videoHero && (
        <video
          ref={videoRef}
          key={config.videoHero}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Video de fondo de la comunidad"
          preload="auto"
          crossOrigin="anonymous"
        >
          <source src={config.videoHero} type="video/mp4" />
        </video>
      )}

      {/* Fallback / placeholder mientras carga */}
      <div
        className={`absolute inset-0 h-full w-full bg-black object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src="/hero/hero_bg.png"
          alt="Comunidad reunida en adoración"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Content */}
      <motion.header
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="text-amber mb-4 text-xs font-bold tracking-[0.3em]"
        >
          {dict.home.hero.welcome}
        </motion.p>
        <motion.h1
          variants={itemVariants}
          id="hero-heading"
          className="mb-6 text-5xl font-bold text-white sm:text-6xl lg:text-7xl"
        >
          {dict.home.hero.title}{" "}
          <span className="text-amber font-serif italic">
            {dict.home.hero.titleEmphasis}
          </span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80"
        >
          {dict.home.hero.subtitle}
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            className="bg-amber shadow-amber/25 hover:bg-amber-dark hover:shadow-amber/30 h-12 rounded-full px-8 text-sm font-bold tracking-wider text-white shadow-lg hover:shadow-xl"
          >
            <Link href={`/${lang}/horarios`}>{dict.home.hero.cta}</Link>
          </Button>
        </motion.div>
      </motion.header>
    </section>
  )
}

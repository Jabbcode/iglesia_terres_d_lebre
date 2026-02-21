"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion, Variants } from "framer-motion"

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

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
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <figure
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')",
        }}
        role="img"
        aria-label="Comunidad reunida en adoración"
      />
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
          TE ESTÁBAMOS ESPERANDO
        </motion.p>
        <motion.h1
          variants={itemVariants}
          id="hero-heading"
          className="mb-6 text-5xl font-bold text-white sm:text-6xl lg:text-7xl"
        >
          Bienvenidos{" "}
          <span className="text-amber font-serif italic">a Casa</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80"
        >
          Somos una comunidad de fe donde cada persona encuentra su lugar. Un
          espacio para crecer, servir y vivir en el amor de Dios.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            className="bg-amber shadow-amber/25 hover:bg-amber-dark hover:shadow-amber/30 h-12 rounded-full px-8 text-sm font-bold tracking-wider text-white shadow-lg hover:shadow-xl"
          >
            <Link href="/horarios">Ver servicios</Link>
          </Button>
        </motion.div>
      </motion.header>
    </section>
  )
}

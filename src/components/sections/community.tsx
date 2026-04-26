"use client"

import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

interface CommunityProps {
  lang: Locale
  dict: Dictionary
}

export function Community({ lang: _lang, dict }: CommunityProps) {
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
            {dict.home.community.badge}
          </p>
          <h2
            id="community-heading"
            className="text-foreground mb-4 text-3xl font-bold sm:text-4xl"
          >
            {dict.home.community.title}
          </h2>
          <div className="bg-amber mx-auto mb-6 h-1 w-16 rounded-full" />
          <p className="text-muted-foreground text-base leading-relaxed">
            {dict.home.community.description}
          </p>
        </div>
      </div>
    </section>
  )
}

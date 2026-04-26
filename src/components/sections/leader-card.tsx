"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeInUp } from "@/components/ui/motion"
import type { Dictionary } from "@/dictionaries"

export interface Leader {
  name: string
  role: string
  description: string
  image: string
}

interface LeaderCardProps {
  leader: Leader
  dict: Dictionary
}

export function LeaderCard({ leader, dict }: LeaderCardProps) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <FadeInUp>
      <div className="group w-full max-w-sm overflow-hidden rounded-lg bg-white text-center">
        {/* Image with overlay */}
        <div className="relative mb-6 overflow-hidden">
          <img
            src={leader.image}
            alt={leader.name}
            className="w-full object-cover"
            loading="lazy"
          />
          {/* Overlay con descripción */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 ${
              showHistory ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-center text-sm leading-relaxed text-white">
              {leader.description}
            </p>
          </div>
        </div>
        {/* Content */}
        <div className="px-4 pb-6">
          <h3 className="text-foreground mb-2 text-xl font-bold">
            {leader.name}
          </h3>
          <p className="text-amber mb-4 text-lg font-bold">{leader.role}</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber hover:bg-amber/10 hover:text-amber h-auto px-2 py-1 text-xs cursor-pointer"
            onClick={() => setShowHistory(!showHistory)}
          >
            <Info className="mr-1 size-3" />
            {showHistory
              ? dict.about.leadership.hideHistory
              : dict.about.leadership.showHistory}
          </Button>
        </div>
      </div>
    </FadeInUp>
  )
}

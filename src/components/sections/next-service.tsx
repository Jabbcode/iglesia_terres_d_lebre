"use client"

import { useEffect } from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Countdown } from "@/components/sections/countdown"
import { useConfigStore } from "@/stores/config-store"

function getNextSundayServiceDate(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const nextSunday = new Date(now)
  nextSunday.setDate(now.getDate() + daysUntilSunday)
  nextSunday.setHours(11, 0, 0, 0)
  if (daysUntilSunday === 0 && now.getHours() >= 13) {
    nextSunday.setDate(nextSunday.getDate() + 7)
  }
  return nextSunday
}

export function NextService() {
  const { config, fetchConfig } = useConfigStore()

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const serviceTime = "Domingo, 11:30"
  const address = config?.direccion?.replace("\n", ", ") || ""
  const nextServiceDate = getNextSundayServiceDate().toISOString()

  return (
    <aside
      aria-label="Información del próximo servicio"
      className="relative z-10 mx-auto -mt-12 max-w-5xl px-4"
    >
      <div className="border-border/50 rounded-2xl border bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          {/* Service info */}
          <div className="text-center lg:text-left">
            <p className="text-amber mb-1 text-xs font-bold tracking-widest">
              PRÓXIMO SERVICIO
            </p>
            <h2 className="text-foreground text-xl font-bold sm:text-2xl">
              {serviceTime}
            </h2>
            <address className="text-muted-foreground mt-1 text-sm not-italic">
              {address}
            </address>
          </div>

          {/* Countdown */}
          <Countdown targetDate={nextServiceDate} />

          {/* Actions */}
          <Button
            asChild
            className="bg-amber shadow-amber/25 hover:bg-amber-dark hover:shadow-amber/30 h-10 gap-2 rounded-full px-5 text-xs font-semibold text-white shadow-lg hover:shadow-xl"
          >
            <Link href="/contacto">
              <MapPin className="size-4" aria-hidden="true" />
              Cómo llegar
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

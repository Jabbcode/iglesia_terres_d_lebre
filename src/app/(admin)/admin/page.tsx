"use client"

import { useState, useEffect } from "react"
import { Image, Calendar, Clock, CalendarCheck } from "lucide-react"
import { StatCard } from "@/components/admin/StatCard"

interface Stats {
  imagenes: number
  eventos: number
  horarios: number
  proximosEventos: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido al panel de administracion
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Imagenes en Galeria"
            value={stats.imagenes}
            icon={Image}
          />
          <StatCard
            title="Eventos Activos"
            value={stats.eventos}
            icon={Calendar}
          />
          <StatCard
            title="Horarios Configurados"
            value={stats.horarios}
            icon={Clock}
          />
          <StatCard
            title="Eventos Proximos"
            value={stats.proximosEventos}
            icon={CalendarCheck}
            description="En los proximos 7 dias"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <p className="text-muted-foreground">
            Error al cargar las estadisticas.
          </p>
        </div>
      )}
    </div>
  )
}

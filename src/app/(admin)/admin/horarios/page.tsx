"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  Church,
  Book,
  Heart,
  Users,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
  Cross,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const iconMap: Record<string, LucideIcon> = {
  Church,
  Book,
  Heart,
  Users,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
  Cross,
  Clock,
}

interface Horario {
  id: string
  titulo: string
  descripcion: string | null
  dia: string
  hora: string
  icono: string
  order: number
  activo: boolean
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchHorarios()
  }, [])

  const fetchHorarios = async () => {
    try {
      const res = await fetch("/api/admin/horarios")
      const data = await res.json()
      setHorarios(data)
    } catch {
      console.error("Error fetching schedules")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estas seguro de eliminar este horario?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/horarios/${id}`, { method: "DELETE" })
      if (res.ok) {
        setHorarios(horarios.filter((h) => h.id !== id))
      }
    } catch {
      console.error("Error deleting schedule")
    } finally {
      setDeleting(null)
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Clock
    return <IconComponent className="size-5" />
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Horarios de Servicios
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los horarios de servicios de la iglesia
          </p>
        </div>
        <Link href="/admin/horarios/nuevo">
          <Button className="bg-amber hover:bg-amber-dark gap-2">
            <Plus className="size-4" />
            Agregar Horario
          </Button>
        </Link>
      </div>

      {horarios.length === 0 ? (
        <div className="border-border/50 flex flex-col items-center justify-center rounded-xl border bg-white p-12 shadow-sm">
          <Clock className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4">
            No hay horarios configurados
          </p>
          <Link href="/admin/horarios/nuevo" className="mt-4">
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Agregar primer horario
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {horarios.map((horario) => (
            <div
              key={horario.id}
              className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber/10 text-amber flex size-12 items-center justify-center rounded-lg">
                  {getIcon(horario.icono)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground font-semibold">
                      {horario.titulo}
                    </h3>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        horario.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {horario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  {horario.descripcion && (
                    <p className="text-muted-foreground text-sm">
                      {horario.descripcion}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-1 text-sm">
                    {horario.dia} - {horario.hora}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Orden: {horario.order}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/admin/horarios/${horario.id}`}>
                    <Button size="icon" variant="secondary" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8"
                    onClick={() => handleDelete(horario.id)}
                    disabled={deleting === horario.id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

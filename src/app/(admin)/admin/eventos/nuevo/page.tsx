"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const periodicidadOptions = [
  { value: "ninguna", label: "Sin repeticion" },
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual" },
] as const

const eventoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string(),
  fecha: z.string().min(1, "Fecha requerida"),
  horaInicio: z.string().min(1, "Hora de inicio requerida"),
  horaFin: z.string(),
  ubicacion: z.string(),
  periodicidad: z.enum(["ninguna", "semanal", "quincenal", "mensual", "anual"]),
  repetirHasta: z.string(),
  activo: z.boolean(),
})

type EventoForm = z.infer<typeof eventoSchema>

export default function NuevoEventoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventoForm>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      descripcion: "",
      horaFin: "",
      ubicacion: "",
      periodicidad: "ninguna",
      repetirHasta: "",
      activo: true,
    },
  })

  const periodicidad = watch("periodicidad")
  const esPeriodico = periodicidad !== "ninguna"

  const onSubmit = async (data: EventoForm) => {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        fecha: new Date(data.fecha).toISOString(),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin || null,
        ubicacion: data.ubicacion || null,
        periodicidad: data.periodicidad,
        repetirHasta:
          esPeriodico && data.repetirHasta
            ? new Date(data.repetirHasta).toISOString()
            : null,
        activo: data.activo,
      }

      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/admin/eventos")
      } else {
        setError("Error al crear el evento")
      }
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/eventos"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a eventos
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Nuevo Evento</h1>
        <p className="text-muted-foreground mt-1">
          Crea un nuevo evento para la iglesia
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Nombre del Evento
              </label>
              <input
                {...register("nombre")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Descripcion
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Fecha
                </label>
                <input
                  {...register("fecha")}
                  type="date"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.fecha && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fecha.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Hora Inicio
                </label>
                <input
                  {...register("horaInicio")}
                  type="time"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.horaInicio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.horaInicio.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Hora Fin
                </label>
                <input
                  {...register("horaFin")}
                  type="time"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Ubicacion
              </label>
              <input
                {...register("ubicacion")}
                placeholder="Ej: Sala principal, Patio, etc."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register("activo")}
                type="checkbox"
                id="activo"
                className="border-border size-4 rounded"
              />
              <label
                htmlFor="activo"
                className="text-foreground text-sm font-medium"
              >
                Evento activo
              </label>
            </div>
          </div>
        </div>

        {/* Seccion de periodicidad */}
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <RefreshCw className="text-amber size-5" />
            <h2 className="text-foreground font-semibold">
              Evento Periodico
            </h2>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            Configura si este evento se repite automaticamente.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Repeticion
              </label>
              <select
                {...register("periodicidad")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              >
                {periodicidadOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {esPeriodico && (
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Repetir hasta (opcional)
                </label>
                <input
                  {...register("repetirHasta")}
                  type="date"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Si no se especifica, el evento se repetira indefinidamente.
                </p>
              </div>
            )}

            {esPeriodico && (
              <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> La fecha del evento se usara como fecha
                  base. El sistema calculara automaticamente la proxima
                  ocurrencia.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/eventos">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-amber hover:bg-amber-dark gap-2"
          >
            <Save className="size-4" />
            {saving ? "Guardando..." : "Crear Evento"}
          </Button>
        </div>
      </form>
    </div>
  )
}

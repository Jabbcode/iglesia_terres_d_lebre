"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const horarioSchema = z.object({
  titulo: z.string().min(1, "Titulo requerido"),
  descripcion: z.string(),
  dia: z.string().min(1, "Dia requerido"),
  hora: z.string().min(1, "Hora requerida"),
  icono: z.string(),
  order: z.number().int(),
  activo: z.boolean(),
})

type HorarioForm = z.infer<typeof horarioSchema>

const iconOptions = [
  "Church",
  "Book",
  "Heart",
  "Users",
  "Music",
  "Mic2",
  "Sun",
  "Moon",
  "Star",
  "Cross",
]

const diaOptions = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
]

export default function NuevoHorarioPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HorarioForm>({
    resolver: zodResolver(horarioSchema),
    defaultValues: {
      descripcion: "",
      icono: "Church",
      order: 0,
      activo: true,
    },
  })

  const onSubmit = async (data: HorarioForm) => {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion || null,
        dia: data.dia,
        hora: data.hora,
        icono: data.icono,
        order: data.order,
        activo: data.activo,
      }

      const res = await fetch("/api/admin/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/admin/horarios")
      } else {
        setError("Error al crear el horario")
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
          href="/admin/horarios"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a horarios
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Nuevo Horario</h1>
        <p className="mt-1 text-muted-foreground">Crea un nuevo horario de servicio</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Titulo
              </label>
              <input
                {...register("titulo")}
                placeholder="Ej: Culto Dominical"
                className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-500">{errors.titulo.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Descripcion
              </label>
              <textarea
                {...register("descripcion")}
                rows={2}
                placeholder="Descripcion breve del servicio"
                className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Dia
                </label>
                <select
                  {...register("dia")}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
                >
                  <option value="">Seleccionar dia</option>
                  {diaOptions.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
                {errors.dia && (
                  <p className="mt-1 text-sm text-red-500">{errors.dia.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Hora
                </label>
                <input
                  {...register("hora")}
                  placeholder="Ej: 11:00h"
                  className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
                />
                {errors.hora && (
                  <p className="mt-1 text-sm text-red-500">{errors.hora.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Icono
                </label>
                <select
                  {...register("icono")}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Orden
                </label>
                <input
                  {...register("order", { valueAsNumber: true })}
                  type="number"
                  className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register("activo")}
                type="checkbox"
                id="activo"
                className="size-4 rounded border-border"
              />
              <label htmlFor="activo" className="text-sm font-medium text-foreground">
                Horario activo
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/horarios">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={saving} className="gap-2 bg-amber hover:bg-amber-dark">
            <Save className="size-4" />
            {saving ? "Guardando..." : "Crear Horario"}
          </Button>
        </div>
      </form>
    </div>
  )
}

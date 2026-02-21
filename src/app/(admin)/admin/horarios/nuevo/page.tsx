"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconSelector } from "@/components/admin/icon-selector"
import { ImageUpload } from "@/components/admin/image-upload"
import Link from "next/link"

const horarioSchema = z.object({
  titulo: z.string().min(1, "Titulo requerido"),
  subtitulo: z.string(),
  descripcion: z.string(),
  descripcionLarga: z.string(),
  dia: z.string().min(1, "Dia requerido"),
  hora: z.string().min(1, "Hora requerida"),
  icono: z.string(),
  imagen: z.string(),
  mostrarDetalle: z.boolean(),
  order: z.number().int(),
  activo: z.boolean(),
})

type HorarioForm = z.infer<typeof horarioSchema>

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<HorarioForm>({
    resolver: zodResolver(horarioSchema),
    defaultValues: {
      subtitulo: "",
      descripcion: "",
      descripcionLarga: "",
      icono: "Church",
      imagen: "",
      mostrarDetalle: false,
      order: 0,
      activo: true,
    },
  })

  const mostrarDetalle = watch("mostrarDetalle")
  const imagenValue = watch("imagen")

  // Desactivar mostrarDetalle si se elimina la imagen
  useEffect(() => {
    if (!imagenValue && mostrarDetalle) {
      setValue("mostrarDetalle", false)
    }
  }, [imagenValue, mostrarDetalle, setValue])

  const onSubmit = async (data: HorarioForm) => {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        titulo: data.titulo,
        subtitulo: data.subtitulo || null,
        descripcion: data.descripcion || null,
        descripcionLarga: data.descripcionLarga || null,
        dia: data.dia,
        hora: data.hora,
        icono: data.icono,
        imagen: data.imagen || null,
        mostrarDetalle: data.mostrarDetalle,
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
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a horarios
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Nuevo Horario</h1>
        <p className="text-muted-foreground mt-1">
          Crea un nuevo horario de servicio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Información básica */}
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-foreground mb-4 font-semibold">
            Informacion Basica
          </h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Titulo
                </label>
                <input
                  {...register("titulo")}
                  placeholder="Ej: Culto Dominical"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.titulo && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Subtitulo (opcional)
                </label>
                <input
                  {...register("subtitulo")}
                  placeholder="Ej: semanal"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Se muestra en cursiva junto al titulo
                </p>
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Descripcion corta (opcional)
              </label>
              <textarea
                {...register("descripcion")}
                rows={2}
                placeholder="Descripcion breve del servicio"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Dia
                </label>
                <select
                  {...register("dia")}
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                >
                  <option value="">Seleccionar dia</option>
                  {diaOptions.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
                {errors.dia && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.dia.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Hora
                </label>
                <input
                  {...register("hora")}
                  placeholder="Ej: 11:00h"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.hora && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.hora.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Icono
                </label>
                <IconSelector
                  value={watch("icono")}
                  onValueChange={(value) => setValue("icono", value)}
                />
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Orden
                </label>
                <input
                  {...register("order", { valueAsNumber: true })}
                  type="number"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
              </div>
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
                Horario activo
              </label>
            </div>
          </div>
        </div>

        {/* Sección de detalle */}
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-foreground font-semibold">
                Seccion de Detalle
              </h2>
              <p className="text-muted-foreground text-sm">
                Muestra este horario con imagen y descripcion ampliada
              </p>
            </div>
            <Switch
              checked={mostrarDetalle}
              onCheckedChange={(checked) => setValue("mostrarDetalle", checked)}
              disabled={!imagenValue}
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Imagen
              </label>
              <ImageUpload
                value={imagenValue}
                onChange={(url) => setValue("imagen", url)}
                folder="horarios"
                placeholder="Subir imagen del horario"
              />
              {!imagenValue && (
                <p className="mt-1 text-xs text-amber-600">
                  Requerida para mostrar la seccion de detalle
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Descripcion Larga
              </label>
              <textarea
                {...register("descripcionLarga")}
                rows={4}
                placeholder="Descripcion detallada que se mostrara en la seccion inferior de la pagina de horarios"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/horarios">
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
            {saving ? "Guardando..." : "Crear Horario"}
          </Button>
        </div>
      </form>
    </div>
  )
}

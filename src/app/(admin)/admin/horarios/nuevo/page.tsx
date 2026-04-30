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
import { TranslationFields } from "@/components/admin/translation-fields"
import Link from "next/link"
import { api } from "@/shared/api"
import { DIAS_SEMANA } from "@/lib/constants"
import { uploadFile } from "@/lib/supabase"

const horarioSchema = z.object({
  titulo: z.string().min(1, "Titulo requerido"),
  subtitulo: z.string(),
  descripcionLarga: z.string(),
  dia: z.string().min(1, "Dia requerido"),
  hora: z.string().min(1, "Hora requerida"),
  icono: z.string(),
  mostrarDetalle: z.boolean(),
  activo: z.boolean(),
  // Traducciones Català
  ca_titulo: z.string(),
  ca_subtitulo: z.string(),
  ca_dia: z.string(),
  ca_descripcionLarga: z.string(),
  // Traducciones English
  en_titulo: z.string(),
  en_subtitulo: z.string(),
  en_dia: z.string(),
  en_descripcionLarga: z.string(),
})

type HorarioForm = z.infer<typeof horarioSchema>

export default function NuevoHorarioPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagen, setImagen] = useState<string | File | null>(null)

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
      descripcionLarga: "",
      icono: "Church",
      mostrarDetalle: false,
      activo: true,
      ca_titulo: "",
      ca_subtitulo: "",
      ca_dia: "",
      ca_descripcionLarga: "",
      en_titulo: "",
      en_subtitulo: "",
      en_dia: "",
      en_descripcionLarga: "",
    },
  })

  const mostrarDetalle = watch("mostrarDetalle")

  useEffect(() => {
    if (!imagen && mostrarDetalle) {
      setValue("mostrarDetalle", false)
    }
  }, [imagen, mostrarDetalle, setValue])

  const onSubmit = async (data: HorarioForm) => {
    setSaving(true)
    setError(null)

    try {
      let imagenUrl: string | null = null
      if (imagen instanceof File) {
        imagenUrl = await uploadFile(imagen, "horarios")
        if (!imagenUrl) {
          setError("Error al subir la imagen")
          setSaving(false)
          return
        }
      } else if (typeof imagen === "string") {
        imagenUrl = imagen
      }

      let newOrder = 0
      try {
        const response = await api.get<{ maxOrder: number }>(
          "/api/admin/horarios/max-order"
        )
        newOrder = response.maxOrder + 1
      } catch {
        newOrder = 0
      }

      const translations = []
      if (data.ca_titulo) {
        translations.push({
          lang: "ca" as const,
          titulo: data.ca_titulo,
          subtitulo: data.ca_subtitulo || null,
          dia: data.ca_dia || data.dia,
          descripcionLarga: data.ca_descripcionLarga || null,
        })
      }
      if (data.en_titulo) {
        translations.push({
          lang: "en" as const,
          titulo: data.en_titulo,
          subtitulo: data.en_subtitulo || null,
          dia: data.en_dia || data.dia,
          descripcionLarga: data.en_descripcionLarga || null,
        })
      }

      await api.post("/api/admin/horarios", {
        titulo: data.titulo,
        subtitulo: data.subtitulo || null,
        descripcionLarga: data.descripcionLarga || null,
        dia: data.dia,
        hora: data.hora,
        icono: data.icono,
        imagen: imagenUrl,
        mostrarDetalle: data.mostrarDetalle,
        order: newOrder,
        activo: data.activo,
        translations: translations.length > 0 ? translations : undefined,
      })
      router.push("/admin/horarios")
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button asChild className="bg-amber hover:bg-amber-dark gap-2">
          <Link href="/admin/horarios">
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-foreground text-xl font-bold">Nuevo Horario</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
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
                    {DIAS_SEMANA.map((dia) => (
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
                onCheckedChange={(checked) =>
                  setValue("mostrarDetalle", checked)
                }
                disabled={!imagen}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Imagen
                </label>
                <ImageUpload
                  value={imagen}
                  onChange={setImagen}
                  placeholder="Subir imagen del horario"
                />
                {!imagen && (
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
        </div>

        {/* Traducciones */}
        <TranslationFields
          lang="ca"
          langName="Català"
          fields={[
            {
              name: "ca_titulo",
              label: "Título",
              placeholder: "Ej: Culte Dominical",
              register: register("ca_titulo"),
            },
            {
              name: "ca_subtitulo",
              label: "Subtítulo (opcional)",
              placeholder: "Ej: setmanal",
              register: register("ca_subtitulo"),
            },
            {
              name: "ca_dia",
              label: "Día",
              placeholder: "Ej: Diumenge",
              register: register("ca_dia"),
            },
            {
              name: "ca_descripcionLarga",
              label: "Descripción larga (opcional)",
              type: "textarea",
              rows: 3,
              placeholder: "Descripció detallada...",
              register: register("ca_descripcionLarga"),
            },
          ]}
        />

        <TranslationFields
          lang="en"
          langName="English"
          fields={[
            {
              name: "en_titulo",
              label: "Title",
              placeholder: "Ex: Sunday Service",
              register: register("en_titulo"),
            },
            {
              name: "en_subtitulo",
              label: "Subtitle (optional)",
              placeholder: "Ex: weekly",
              register: register("en_subtitulo"),
            },
            {
              name: "en_dia",
              label: "Day",
              placeholder: "Ex: Sunday",
              register: register("en_dia"),
            },
            {
              name: "en_descripcionLarga",
              label: "Long description (optional)",
              type: "textarea",
              rows: 3,
              placeholder: "Detailed description...",
              register: register("en_descripcionLarga"),
            },
          ]}
        />

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

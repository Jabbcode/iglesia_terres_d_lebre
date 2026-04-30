"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconSelector } from "@/components/admin/icon-selector"
import { ImageUpload } from "@/components/admin/image-upload"
import { TranslationFields } from "@/components/admin/translation-fields"
import { useConfirm } from "@/components/admin/confirm-dialog"
import Link from "next/link"
import { api } from "@/shared/api"
import type { Horario } from "@/modules/horarios"
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

export default function EditarHorarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagen, setImagen] = useState<string | File | null>(null)
  const [imagenOriginal, setImagenOriginal] = useState<string | null>(null)
  const confirm = useConfirm()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HorarioForm>({
    resolver: zodResolver(horarioSchema),
  })

  const mostrarDetalle = watch("mostrarDetalle")

  useEffect(() => {
    if (!imagen && mostrarDetalle) {
      setValue("mostrarDetalle", false)
    }
  }, [imagen, mostrarDetalle, setValue])

  useEffect(() => {
    api
      .get<Horario[]>("/api/admin/horarios")
      .then((data) => {
        const horario = data.find((h) => h.id === id)
        if (horario) {
          const ca = horario.translations?.find((t) => t.lang === "ca")
          const en = horario.translations?.find((t) => t.lang === "en")
          setImagenOriginal(horario.imagen || null)
          setImagen(horario.imagen || null)
          reset({
            titulo: horario.titulo,
            subtitulo: horario.subtitulo || "",
            descripcionLarga: horario.descripcionLarga || "",
            dia: horario.dia,
            hora: horario.hora,
            icono: horario.icono,
            mostrarDetalle: horario.mostrarDetalle,
            activo: horario.activo,
            ca_titulo: ca?.titulo || "",
            ca_subtitulo: ca?.subtitulo || "",
            ca_dia: ca?.dia || "",
            ca_descripcionLarga: ca?.descripcionLarga || "",
            en_titulo: en?.titulo || "",
            en_subtitulo: en?.subtitulo || "",
            en_dia: en?.dia || "",
            en_descripcionLarga: en?.descripcionLarga || "",
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, reset])

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

      if (imagenOriginal && imagenOriginal !== imagenUrl) {
        try {
          await api.post("/api/admin/images/delete", { url: imagenOriginal })
        } catch (error) {
          console.error("Failed to delete old image from storage:", error)
        }
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

      await api.patch(`/api/admin/horarios/${id}`, {
        titulo: data.titulo,
        subtitulo: data.subtitulo || null,
        descripcionLarga: data.descripcionLarga || null,
        dia: data.dia,
        hora: data.hora,
        icono: data.icono,
        imagen: imagenUrl,
        mostrarDetalle: data.mostrarDetalle,
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

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Eliminar horario",
      description:
        "¿Estas seguro de eliminar este horario? Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    setDeleting(true)
    try {
      await api.delete(`/api/admin/horarios/${id}`)
      router.push("/admin/horarios")
    } catch {
      setError("Error al eliminar")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-96 max-w-2xl rounded-xl bg-gray-200" />
      </div>
    )
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
        <h1 className="text-foreground text-xl font-bold">Editar Horario</h1>
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
                    value={watch("icono") || "Church"}
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

        <div className="flex justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            <Trash2 className="size-4" />
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
          <div className="flex gap-3">
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
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

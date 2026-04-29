"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/components/admin/confirm-dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { TranslationFields } from "@/components/admin/translation-fields"
import Link from "next/link"
import { api } from "@/shared/api"
import type { Evento } from "@/modules/eventos"
import { uploadFile } from "@/lib/supabase"
import {
  PERIODICIDAD_OPTIONS,
  SEMANA_DEL_MES_OPTIONS,
  DIAS_SEMANA_OPTIONS,
} from "@/lib/constants"

const eventoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string(),
  fecha: z.string().min(1, "Fecha requerida"),
  horaInicio: z.string().min(1, "Hora de inicio requerida"),
  horaFin: z.string(),
  ubicacion: z.string(),
  periodicidad: z.enum([
    "ninguna",
    "semanal",
    "quincenal",
    "mensual",
    "mensual_relativo",
    "anual",
  ]),
  repetirHasta: z.string(),
  activo: z.boolean(),
  // Traducciones Català
  nombre_ca: z.string(),
  descripcion_ca: z.string(),
  ubicacion_ca: z.string(),
  // Traducciones English
  nombre_en: z.string(),
  descripcion_en: z.string(),
  ubicacion_en: z.string(),
})

type EventoForm = z.infer<typeof eventoSchema>

export default function EditarEventoPage({
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
  const [semanaDelMes, setSemanaDelMes] = useState<number>(1)
  const [diaSemanaRelativo, setDiaSemanaRelativo] = useState<number>(0)
  const confirm = useConfirm()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventoForm>({
    resolver: zodResolver(eventoSchema),
  })

  const periodicidad = watch("periodicidad")
  const esPeriodico = periodicidad !== "ninguna"
  const esMensualRelativo = periodicidad === "mensual_relativo"

  useEffect(() => {
    api
      .get<Evento[]>("/api/admin/eventos")
      .then((data) => {
        const evento = data.find((e) => e.id === id)
        if (evento) {
          const ca = evento.translations?.find((t) => t.lang === "ca")
          const en = evento.translations?.find((t) => t.lang === "en")
          const fechaDate = new Date(evento.fecha)
          const repetirHastaDate = evento.repetirHasta
            ? new Date(evento.repetirHasta)
            : null

          setImagenOriginal(evento.imagen || null)
          setImagen(evento.imagen || null)

          if (evento.semanaDelMes != null) setSemanaDelMes(evento.semanaDelMes)
          if (evento.diaSemanaRelativo != null)
            setDiaSemanaRelativo(evento.diaSemanaRelativo)

          reset({
            nombre: evento.nombre,
            descripcion: evento.descripcion || "",
            fecha: fechaDate.toISOString().split("T")[0],
            horaInicio: evento.horaInicio,
            horaFin: evento.horaFin || "",
            ubicacion: evento.ubicacion || "",
            periodicidad: evento.periodicidad,
            repetirHasta: repetirHastaDate
              ? repetirHastaDate.toISOString().split("T")[0]
              : "",
            activo: evento.activo,
            nombre_ca: ca?.nombre || "",
            descripcion_ca: ca?.descripcion || "",
            ubicacion_ca: ca?.ubicacion || "",
            nombre_en: en?.nombre || "",
            descripcion_en: en?.descripcion || "",
            ubicacion_en: en?.ubicacion || "",
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: EventoForm) => {
    setSaving(true)
    setError(null)

    try {
      let imagenUrl: string | null = null
      if (imagen instanceof File) {
        imagenUrl = await uploadFile(imagen, "eventos")
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

      const translations = [
        {
          lang: "ca" as const,
          nombre: data.nombre_ca || data.nombre,
          descripcion: data.descripcion_ca || data.descripcion || null,
          ubicacion: data.ubicacion_ca || data.ubicacion || null,
        },
        {
          lang: "en" as const,
          nombre: data.nombre_en || data.nombre,
          descripcion: data.descripcion_en || data.descripcion || null,
          ubicacion: data.ubicacion_en || data.ubicacion || null,
        },
      ]

      await api.patch(`/api/admin/eventos/${id}`, {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        fecha: new Date(data.fecha).toISOString(),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin || null,
        ubicacion: data.ubicacion || null,
        imagen: imagenUrl,
        periodicidad: data.periodicidad,
        semanaDelMes: esMensualRelativo ? semanaDelMes : null,
        diaSemanaRelativo: esMensualRelativo ? diaSemanaRelativo : null,
        repetirHasta:
          esPeriodico && data.repetirHasta
            ? new Date(data.repetirHasta).toISOString()
            : null,
        activo: data.activo,
        translations,
      })
      router.push("/admin/eventos")
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Eliminar evento",
      description:
        "¿Estas seguro de eliminar este evento? Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    setDeleting(true)
    try {
      await api.delete(`/api/admin/eventos/${id}`)
      router.push("/admin/eventos")
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
      <div className="mb-6">
        <Link
          href="/admin/eventos"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a eventos
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Editar Evento</h1>
        <p className="text-muted-foreground mt-1">
          Modifica los datos del evento
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
                  Fecha {esPeriodico && "(base)"}
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

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Imagen del Evento
              </label>
              <ImageUpload
                value={imagen}
                onChange={setImagen}
                placeholder="Subir imagen del evento"
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
            <h2 className="text-foreground font-semibold">Evento Periodico</h2>
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
                {PERIODICIDAD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {esMensualRelativo && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-foreground mb-1 block text-sm font-medium">
                      Semana del mes
                    </label>
                    <select
                      value={semanaDelMes}
                      onChange={(e) => setSemanaDelMes(Number(e.target.value))}
                      className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                    >
                      {SEMANA_DEL_MES_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-sm font-medium">
                      Dia de la semana
                    </label>
                    <select
                      value={diaSemanaRelativo}
                      onChange={(e) =>
                        setDiaSemanaRelativo(Number(e.target.value))
                      }
                      className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                    >
                      {DIAS_SEMANA_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

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
                  {esMensualRelativo ? (
                    <>
                      <strong>Nota:</strong> Se repetira el{" "}
                      <strong>
                        {
                          SEMANA_DEL_MES_OPTIONS.find(
                            (o) => o.value === semanaDelMes
                          )?.label
                        }{" "}
                        {
                          DIAS_SEMANA_OPTIONS.find(
                            (o) => o.value === diaSemanaRelativo
                          )?.label
                        }
                      </strong>{" "}
                      de cada mes.
                    </>
                  ) : (
                    <>
                      <strong>Nota:</strong> La fecha del evento se usara como
                      fecha base. El sistema calculara automaticamente la
                      proxima ocurrencia.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Traducciones */}
        <TranslationFields
          lang="ca"
          langName="Català"
          fields={[
            {
              name: "nombre_ca",
              label: "Nombre del Evento",
              placeholder: "Ej: Culte de Diumenge",
              register: register("nombre_ca"),
            },
            {
              name: "descripcion_ca",
              label: "Descripción",
              type: "textarea",
              rows: 3,
              placeholder: "Descripció de l'esdeveniment...",
              register: register("descripcion_ca"),
            },
            {
              name: "ubicacion_ca",
              label: "Ubicación",
              placeholder: "Ej: Sala principal",
              register: register("ubicacion_ca"),
            },
          ]}
        />

        <TranslationFields
          lang="en"
          langName="English"
          fields={[
            {
              name: "nombre_en",
              label: "Event Name",
              placeholder: "Ex: Sunday Service",
              register: register("nombre_en"),
            },
            {
              name: "descripcion_en",
              label: "Description",
              type: "textarea",
              rows: 3,
              placeholder: "Event description...",
              register: register("descripcion_en"),
            },
            {
              name: "ubicacion_en",
              label: "Location",
              placeholder: "Ex: Main hall",
              register: register("ubicacion_en"),
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
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"

const configSchema = z.object({
  nombreIglesia: z.string().min(1, "Nombre requerido"),
  descripcion: z.string(),
  instagram: z.string().url("URL invalida").or(z.literal("")),
  facebook: z.string().url("URL invalida").or(z.literal("")),
  youtube: z.string().url("URL invalida").or(z.literal("")),
  direccion: z.string(),
  telefono: z.string(),
  email: z.string().email("Email invalido").or(z.literal("")),
  horarioAtencion: z.string(),
  googleMapsUrl: z.string().url("URL invalida").or(z.literal("")),
  googleMapsEmbed: z.string(),
})

type ConfigForm = z.infer<typeof configSchema>

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfigForm>({
    resolver: zodResolver(configSchema),
  })

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        reset({
          nombreIglesia: data.nombreIglesia || "",
          descripcion: data.descripcion || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          youtube: data.youtube || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          email: data.email || "",
          horarioAtencion: data.horarioAtencion || "",
          googleMapsUrl: data.googleMapsUrl || "",
          googleMapsEmbed: data.googleMapsEmbed || "",
        })
      })
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (data: ConfigForm) => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Configuracion guardada" })
      } else {
        setMessage({ type: "error", text: "Error al guardar" })
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexion" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-96 rounded-xl bg-gray-200" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Configuracion</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona la informacion general del sitio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* General */}
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            General
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-foreground mb-1 block text-sm font-medium">
                Nombre de la Iglesia
              </label>
              <input
                {...register("nombreIglesia")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.nombreIglesia && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.nombreIglesia.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-foreground mb-1 block text-sm font-medium">
                Descripcion
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Redes Sociales
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Instagram
              </label>
              <input
                {...register("instagram")}
                placeholder="https://instagram.com/..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.instagram && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.instagram.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Facebook
              </label>
              <input
                {...register("facebook")}
                placeholder="https://facebook.com/..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                YouTube
              </label>
              <input
                {...register("youtube")}
                placeholder="https://youtube.com/..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Contacto
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-foreground mb-1 block text-sm font-medium">
                Direccion
              </label>
              <textarea
                {...register("direccion")}
                rows={2}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Telefono
              </label>
              <input
                {...register("telefono")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Horario de Atencion
              </label>
              <input
                {...register("horarioAtencion")}
                placeholder="Lun-Vie, 9:00-17:00"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                URL Google Maps
              </label>
              <input
                {...register("googleMapsUrl")}
                placeholder="https://maps.google.com/..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-foreground mb-1 block text-sm font-medium">
                Embed Google Maps
              </label>
              <input
                {...register("googleMapsEmbed")}
                placeholder="https://www.google.com/maps/embed?..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-amber hover:bg-amber-dark gap-2"
          >
            <Save className="size-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}

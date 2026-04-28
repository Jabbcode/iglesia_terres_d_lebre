"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoUpload } from "@/components/admin/video-uplodad"
import { api } from "@/shared/api"

const configSchema = z.object({
  videoHero: z.string().min(1, "Video requerido"),
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
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ConfigForm>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      videoHero: "",
    },
  })

  useEffect(() => {
    api
      .get<ConfigForm>("/api/admin/config")
      .then((data) => {
        reset({
          videoHero: data.videoHero || "",
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (data: ConfigForm) => {
    setSaving(true)
    setMessage(null)

    try {
      await api.patch("/api/admin/config", data)
      setMessage({ type: "success", text: "Configuracion guardada" })
    } catch {
      setMessage({ type: "error", text: "Error al guardar" })
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
          Gestiona el video principal del sitio
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

        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Video Principal</h2>
          <div>
            <VideoUpload
              value={watch("videoHero")}
              onChange={(url) => setValue("videoHero", url)}
              folder="site_setting"
              placeholder="Subir video para el hero"
            />
            {errors.videoHero && (
              <p className="mt-1 text-sm text-red-500">
                {errors.videoHero.message}
              </p>
            )}
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

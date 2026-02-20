"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const imagenSchema = z.object({
  src: z.string().url("URL de imagen invalida"),
  alt: z.string().min(1, "Texto alternativo requerido"),
  span: z.enum(["normal", "tall", "wide"]),
  order: z.number().int(),
})

type ImagenForm = z.infer<typeof imagenSchema>

export default function NuevaImagenPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImagenForm>({
    resolver: zodResolver(imagenSchema),
    defaultValues: {
      span: "normal",
      order: 0,
    },
  })

  const onSubmit = async (data: ImagenForm) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/admin/galeria")
      } else {
        setError("Error al crear la imagen")
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
          href="/admin/galeria"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a galeria
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Nueva Imagen</h1>
        <p className="mt-1 text-muted-foreground">Agrega una nueva imagen a la galeria</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                URL de la Imagen
              </label>
              <input
                {...register("src")}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
              />
              {errors.src && (
                <p className="mt-1 text-sm text-red-500">{errors.src.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Texto Alternativo
              </label>
              <input
                {...register("alt")}
                placeholder="Descripcion de la imagen"
                className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
              />
              {errors.alt && (
                <p className="mt-1 text-sm text-red-500">{errors.alt.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Tipo de Imagen
                </label>
                <select
                  {...register("span")}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2 focus:border-amber focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="tall">Vertical (Alta)</option>
                  <option value="wide">Horizontal (Ancha)</option>
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
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/galeria">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={saving} className="gap-2 bg-amber hover:bg-amber-dark">
            <Save className="size-4" />
            {saving ? "Guardando..." : "Guardar Imagen"}
          </Button>
        </div>
      </form>
    </div>
  )
}

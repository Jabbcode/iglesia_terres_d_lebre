"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"
import Link from "next/link"

const tarjetaSchema = z.object({
  titulo: z.string().min(1, "Titulo requerido"),
  descripcion: z.string().min(1, "Descripcion requerida"),
  imagen: z.string().min(1, "Imagen requerida"),
  linkHref: z.string().url("URL invalida").or(z.literal("")),
  linkLabel: z.string(),
  order: z.number().int(),
  activo: z.boolean(),
})

type TarjetaForm = z.infer<typeof tarjetaSchema>

export default function NuevaTarjetaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TarjetaForm>({
    resolver: zodResolver(tarjetaSchema),
    defaultValues: {
      imagen: "",
      linkHref: "",
      linkLabel: "",
      order: 0,
      activo: true,
    },
  })

  const onSubmit = async (data: TarjetaForm) => {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        imagen: data.imagen,
        linkHref: data.linkHref || null,
        linkLabel: data.linkLabel || null,
        order: data.order,
        activo: data.activo,
      }

      const res = await fetch("/api/admin/comunidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/admin/comunidad")
      } else {
        setError("Error al crear la tarjeta")
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
          href="/admin/comunidad"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a comunidad
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Nueva Tarjeta</h1>
        <p className="text-muted-foreground mt-1">
          Crea una nueva tarjeta para la seccion de comunidad
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
                Titulo
              </label>
              <input
                {...register("titulo")}
                placeholder="Ej: Grupos de Vida"
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
                Descripcion
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                placeholder="Descripcion de la tarjeta"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Imagen
              </label>
              <ImageUpload
                value={watch("imagen")}
                onChange={(url) => setValue("imagen", url)}
                folder="comunidad"
                placeholder="Subir imagen de la tarjeta"
              />
              {errors.imagen && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.imagen.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  URL del Enlace (opcional)
                </label>
                <input
                  {...register("linkHref")}
                  placeholder="https://ejemplo.com"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.linkHref && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.linkHref.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Texto del Enlace (opcional)
                </label>
                <input
                  {...register("linkLabel")}
                  placeholder="Ej: VER MAS"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="flex items-end pb-2">
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
                    Tarjeta activa
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/comunidad">
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
            {saving ? "Guardando..." : "Crear Tarjeta"}
          </Button>
        </div>
      </form>
    </div>
  )
}

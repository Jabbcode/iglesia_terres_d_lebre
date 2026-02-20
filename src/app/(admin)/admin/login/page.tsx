"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { IGLESIA_NAME } from "@/lib/constant"

const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "Password requerido"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const result = await res.json()
        setError(result.error || "Error al iniciar sesion")
      }
    } catch {
      setError("Error de conexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border-border/50 rounded-2xl border bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-foreground text-2xl font-bold">
              Panel de Administracion
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">{IGLESIA_NAME}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="border-border text-foreground focus:border-amber focus:ring-amber w-full rounded-lg border bg-white px-4 py-2 focus:ring-1 focus:outline-none"
                placeholder="admin@iglesia.es"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="border-border text-foreground focus:border-amber focus:ring-amber w-full rounded-lg border bg-white px-4 py-2 focus:ring-1 focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-amber hover:bg-amber-dark w-full rounded-lg py-2 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Iniciando..." : "Iniciar Sesion"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

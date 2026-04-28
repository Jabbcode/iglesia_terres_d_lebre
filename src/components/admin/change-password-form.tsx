"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { KeyRound, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api, isApiError } from "@/shared/api"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Contraseña actual requerida"),
    newPassword: z.string().min(8, "Minimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type PasswordForm = z.infer<typeof passwordSchema>

function PasswordInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 pr-10 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
          tabIndex={-1}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export function ChangePasswordForm() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const onSubmit = async (data: PasswordForm) => {
    setSaving(true)
    setMessage(null)
    try {
      await api.post("/api/admin/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setMessage({ type: "success", text: "Contraseña actualizada correctamente" })
      reset()
    } catch (err: unknown) {
      const msg = isApiError(err) ? err.message : "Error al cambiar la contraseña"
      setMessage({ type: "error", text: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Cambiar Contraseña</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <PasswordInput
            label="Contraseña actual"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <div className="space-y-4">
            <PasswordInput
              label="Nueva contraseña"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <PasswordInput
              label="Confirmar contraseña"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="bg-amber hover:bg-amber-dark gap-2">
          <KeyRound className="size-4" />
          {saving ? "Actualizando..." : "Cambiar Contraseña"}
        </Button>
      </div>
    </form>
  )
}

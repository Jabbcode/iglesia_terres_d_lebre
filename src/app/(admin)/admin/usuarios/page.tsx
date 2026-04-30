"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2, KeyRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/components/admin/confirm-dialog"
import { api } from "@/shared/api"
import type { UsuarioPublico } from "@/modules/usuarios"

const createSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(["ADMIN", "EDITOR"]),
})

const passwordSchema = z.object({
  newPassword: z.string().min(8, "Mínimo 8 caracteres"),
})

type CreateForm = z.infer<typeof createSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioPublico[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [resetTarget, setResetTarget] = useState<UsuarioPublico | null>(null)
  const [error, setError] = useState<string | null>(null)
  const confirm = useConfirm()

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: "EDITOR" },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    api
      .get<UsuarioPublico[]>("/api/admin/usuarios")
      .then(setUsuarios)
      .catch(() => setError("Error al cargar usuarios"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data: CreateForm) => {
    try {
      const nuevo = await api.post<UsuarioPublico>("/api/admin/usuarios", data)
      setUsuarios((prev) => [...prev, nuevo])
      setShowCreate(false)
      createForm.reset({ role: "EDITOR" })
    } catch {
      setError("Error al crear usuario")
    }
  }

  const handleResetPassword = async (data: PasswordForm) => {
    if (!resetTarget) return
    try {
      await api.patch(`/api/admin/usuarios/${resetTarget.id}`, data)
      setResetTarget(null)
      passwordForm.reset()
    } catch {
      setError("Error al cambiar contraseña")
    }
  }

  const handleDelete = async (usuario: UsuarioPublico) => {
    const confirmed = await confirm({
      title: "Eliminar usuario",
      description: `¿Eliminar a ${usuario.name}? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })
    if (!confirmed) return
    try {
      await api.delete(`/api/admin/usuarios/${usuario.id}`)
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar usuario")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los accesos al panel de administración
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-amber hover:bg-amber-dark gap-2"
        >
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError(null)}>
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-semibold">Nuevo usuario</h2>
            <button
              onClick={() => {
                setShowCreate(false)
                createForm.reset({ role: "EDITOR" })
              }}
            >
              <X className="text-muted-foreground size-5" />
            </button>
          </div>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Nombre
              </label>
              <input
                {...createForm.register("name")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {createForm.formState.errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {createForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                {...createForm.register("email")}
                type="email"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {createForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {createForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Contraseña
              </label>
              <input
                {...createForm.register("password")}
                type="password"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {createForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {createForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Rol
              </label>
              <select
                {...createForm.register("role")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              >
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreate(false)
                  createForm.reset({ role: "EDITOR" })
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createForm.formState.isSubmitting}
                className="bg-amber hover:bg-amber-dark"
              >
                {createForm.formState.isSubmitting
                  ? "Creando..."
                  : "Crear usuario"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reset password form */}
      {resetTarget && (
        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-semibold">
              Resetear contraseña — {resetTarget.name}
            </h2>
            <button
              onClick={() => {
                setResetTarget(null)
                passwordForm.reset()
              }}
            >
              <X className="text-muted-foreground size-5" />
            </button>
          </div>
          <form
            onSubmit={passwordForm.handleSubmit(handleResetPassword)}
            className="flex gap-4"
          >
            <div className="flex-1">
              <input
                {...passwordForm.register("newPassword")}
                type="password"
                placeholder="Nueva contraseña (mínimo 8 caracteres)"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="bg-amber hover:bg-amber-dark shrink-0"
            >
              {passwordForm.formState.isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </form>
        </div>
      )}

      {/* User list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <div className="border-border/50 divide-border/50 divide-y rounded-xl border bg-white shadow-sm">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="text-foreground font-medium">{usuario.name}</p>
                <p className="text-muted-foreground text-sm">{usuario.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    usuario.role === "ADMIN"
                      ? "bg-amber/10 text-amber-dark"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {usuario.role}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setResetTarget(usuario)
                    passwordForm.reset()
                  }}
                  title="Resetear contraseña"
                >
                  <KeyRound className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-red-400 hover:text-red-600"
                  onClick={() => handleDelete(usuario)}
                  title="Eliminar usuario"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

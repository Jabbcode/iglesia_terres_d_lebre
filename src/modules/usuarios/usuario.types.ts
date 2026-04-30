export type UsuarioPublico = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "EDITOR"
  createdAt: Date
}

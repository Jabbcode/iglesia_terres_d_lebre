import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { CreateUsuarioInput, UpdateUsuarioInput } from "./usuario.schema"

const SELECT_PUBLIC = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const

export const usuarioService = {
  async getAll() {
    return prisma.user.findMany({
      select: SELECT_PUBLIC,
      orderBy: { createdAt: "asc" },
    })
  },

  async create(data: CreateUsuarioInput) {
    const hashed = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role,
      },
      select: SELECT_PUBLIC,
    })
  },

  async update(id: string, data: UpdateUsuarioInput) {
    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.newPassword !== undefined) {
      updateData.password = await bcrypt.hash(data.newPassword, 10)
    }
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: SELECT_PUBLIC,
    })
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id }, select: SELECT_PUBLIC })
  },
}

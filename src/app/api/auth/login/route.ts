import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/modules/auth"
import { validationError, unauthorized, serverError } from "@/shared/api"
import { checkRateLimit } from "@/lib/rate-limit"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const { allowed, retryAfterMs } = checkRateLimit(`login:${ip}`, {
    limit: 5,
    windowMs: 60_000, // 5 intentos por minuto por IP
  })

  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo de nuevo en un momento." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    )
  }

  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return unauthorized("Credenciales incorrectas")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return unauthorized("Credenciales incorrectas")
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error)
    }
    return serverError(error)
  }
}

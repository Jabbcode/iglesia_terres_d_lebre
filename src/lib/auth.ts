import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose"
import { cookies } from "next/headers"

const rawSecret = process.env.JWT_SECRET
if (!rawSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET env var is required in production")
}
const JWT_SECRET = new TextEncoder().encode(
  rawSecret ?? "dev-only-secret-not-for-production"
)

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as JoseJWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  return verifyToken(token)
}

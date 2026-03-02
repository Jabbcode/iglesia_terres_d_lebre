import { getSession } from "@/lib/auth"
import { success } from "@/shared/api"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return success({ user: null })
  }

  return success({
    user: {
      userId: session.userId,
      email: session.email,
      role: session.role,
    },
  })
}

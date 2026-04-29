import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { configService, updateConfigSchema } from "@/modules/config"
import { withAuth } from "@/modules/auth"
import { success, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const config = await configService.get()
    return success(config)
  } catch (error) {
    return handleError(error)
  }
})

export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = updateConfigSchema.parse(body)
    const config = await configService.update(data)
    revalidatePath("/api/public/config")
    return success(config)
  } catch (error) {
    return handleError(error)
  }
})

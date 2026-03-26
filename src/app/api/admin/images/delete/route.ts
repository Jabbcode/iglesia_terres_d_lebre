import { NextRequest } from "next/server"
import { withAuth } from "@/modules/auth"
import { success, handleError } from "@/shared/api"
import { deleteImage } from "@/lib/supabase"
import { z } from "zod"

const deleteImageSchema = z.object({
  url: z.string().url("URL inválida"),
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { url } = deleteImageSchema.parse(body)

    const deleted = await deleteImage(url)

    if (!deleted) {
      return handleError(new Error("Failed to delete image from storage"))
    }

    return success({ deleted: true })
  } catch (error) {
    return handleError(error)
  }
})

import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import {
  testimonioService,
  createTestimonioSchema,
} from "@/modules/testimonios"
import { withAuth } from "@/modules/auth"
import { success, created, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const testimonios = await testimonioService.getAll()
    return success(testimonios)
  } catch (error) {
    return handleError(error)
  }
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = createTestimonioSchema.parse(body)
    const testimonio = await testimonioService.create(data)
    revalidatePath("/api/public/testimonios")
    return created(testimonio)
  } catch (error) {
    return handleError(error)
  }
})

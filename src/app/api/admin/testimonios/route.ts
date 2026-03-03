import { NextRequest } from "next/server"
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
    return created(testimonio)
  } catch (error) {
    return handleError(error)
  }
})

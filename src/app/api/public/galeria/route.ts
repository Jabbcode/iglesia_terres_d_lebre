import { NextRequest } from "next/server"
import { imagenService } from "@/modules/galeria"
import { publicSuccess, handleError } from "@/shared/api"

const PAGE_SIZE = 20

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined
    const result = cursor
      ? await imagenService.getPublicPage({ limit: PAGE_SIZE, cursor })
      : await imagenService.getPublicCached(PAGE_SIZE)
    return publicSuccess(result)
  } catch (error) {
    return handleError(error)
  }
}

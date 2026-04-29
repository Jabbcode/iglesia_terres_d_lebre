import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/modules/auth"
import { supabaseAdmin } from "@/lib/supabase"

const IMAGE_MAX_BYTES = 5 * 1024 * 1024
const VIDEO_MAX_BYTES = 50 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]

export const POST = withAuth(async (request: NextRequest) => {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Storage no configurado" }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const folder = (formData.get("folder") as string) || "general"

  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 })
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 })
  }

  const maxBytes = isImage ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES
  if (file.size > maxBytes) {
    const limitMB = maxBytes / 1024 / 1024
    return NextResponse.json({ error: `El archivo supera el límite de ${limitMB}MB` }, { status: 400 })
  }

  const bucket = isImage ? "images" : "videos"
  const ext = file.name.split(".").pop()
  const fileName = isImage
    ? `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    : `${folder}/${Date.now()}-${file.name}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

  return NextResponse.json({ url: data.publicUrl })
})

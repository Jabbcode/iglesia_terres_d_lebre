import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Server client with service role (only use in API routes)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function deleteImage(url: string): Promise<boolean> {
  try {
    if (!supabaseAdmin) {
      console.error("supabaseAdmin not configured")
      return false
    }

    const match = url.match(/\/storage\/v1\/object\/public\/images\/(.+)$/)
    const path = match ? match[1] : null

    if (!path) {
      console.error("Could not extract path from URL:", url)
      return false
    }

    const { error } = await supabaseAdmin.storage.from("images").remove([path])

    if (error) {
      console.error("Error deleting image from storage:", error)
      return false
    }

    return true
  } catch (err) {
    console.error("Exception while deleting image:", err)
    return false
  }
}

export async function uploadFile(
  file: File,
  folder: string
): Promise<string | null> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    console.error("Error uploading file:", data.error)
    return null
  }

  const data = await response.json()
  return data.url ?? null
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client for browser (uploads)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client with service role for deletions (only use in API routes)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function uploadImage(
  file: File,
  folder: string
): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }

  const { data } = supabase.storage.from("images").getPublicUrl(fileName)

  return data.publicUrl
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const client = supabaseAdmin || supabase
    console.log("Using Supabase client:", supabaseAdmin ? "ADMIN (service role)" : "ANON (limited permissions)")

    // Extract path from Supabase URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/images/{path}
    const match = url.match(/\/storage\/v1\/object\/public\/images\/(.+)$/)
    const path = match ? match[1] : null

    if (!path) {
      console.error("Could not extract path from URL:", url)
      console.error(
        "URL pattern should be: .../storage/v1/object/public/images/{path}"
      )
      return false
    }

    console.log("Attempting to delete from storage:", path)

    const { error, data } = await client.storage.from("images").remove([path])

    if (error) {
      console.error("Error deleting image from storage:", error)
      return false
    }

    console.log("Successfully deleted from storage:", data)
    return true
  } catch (err) {
    console.error("Exception while deleting image:", err)
    return false
  }
}

export async function uploadVideo(file: File, folder: string) {
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from("videos")
    .upload(`${folder}/${fileName}`, file)

  if (error) {
    console.error(error)
    return null
  }

  const { data } = supabase.storage
    .from("videos")
    .getPublicUrl(`${folder}/${fileName}`)

  return data.publicUrl
}

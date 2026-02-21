"use client"

import { useState, useRef } from "react"
import { X, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  folder,
  placeholder = "Subir imagen",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const url = await uploadImage(file, folder)
      if (url) {
        onChange(url)
      } else {
        setError("Error al subir la imagen")
      }
    } catch {
      setError("Error al subir la imagen")
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="h-40 w-full rounded-lg border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 size-7"
            onClick={handleRemove}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={uploading}
          className={cn(
            "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-white transition-colors",
            isDragging
              ? "border-amber bg-amber/5"
              : "border-border hover:border-amber hover:bg-gray-50"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="text-amber size-8 animate-spin" />
              <span className="text-muted-foreground text-sm">Subiendo...</span>
            </>
          ) : isDragging ? (
            <>
              <ImageIcon className="text-amber size-8" />
              <span className="text-amber text-sm font-medium">
                Suelta la imagen aqui
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="text-muted-foreground size-8" />
              <span className="text-muted-foreground text-sm">{placeholder}</span>
              <span className="text-muted-foreground text-xs">
                Arrastra o haz clic para seleccionar
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Option to paste URL manually */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">o pega una URL:</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="border-border focus:border-amber flex-1 rounded border bg-white px-2 py-1 text-xs focus:outline-none"
        />
      </div>
    </div>
  )
}

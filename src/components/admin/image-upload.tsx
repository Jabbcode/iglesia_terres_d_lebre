"use client"

import { useState, useRef, useEffect } from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string | File | null
  onChange: (value: string | File | null) => void
  folder?: string
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "Subir imagen",
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Create preview URL for File objects
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreviewUrl(null)
    }
  }, [value])

  const processFile = (file: File) => {
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
    onChange(file)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
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

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleRemove = () => {
    onChange(null)
  }

  // Get display URL (File preview or string URL)
  const displayUrl = value instanceof File ? previewUrl : value

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative">
          <img
            src={displayUrl}
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
          className={cn(
            "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-white transition-colors",
            isDragging
              ? "border-amber bg-amber/5"
              : "border-border hover:border-amber hover:bg-gray-50"
          )}
        >
          {isDragging ? (
            <>
              <ImageIcon className="text-amber size-8" />
              <span className="text-amber text-sm font-medium">
                Suelta la imagen aqui
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="text-muted-foreground size-8" />
              <span className="text-muted-foreground text-sm">
                {placeholder}
              </span>
              <span className="text-muted-foreground text-xs">
                Arrastra o haz clic para seleccionar
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

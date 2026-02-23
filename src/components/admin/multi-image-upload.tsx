"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, ImagePlus, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface FileWithPreview {
  id: string
  file: File
  preview: string
  status: "pending" | "uploading" | "success" | "error"
  url?: string
  error?: string
}

interface MultiImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  onError?: (error: string) => void
  folder?: string
  maxFiles?: number
  maxSizeMB?: number
}

export function MultiImageUpload({
  onUploadComplete,
  onError,
  folder = "galeria",
  maxFiles = 10,
  maxSizeMB = 5,
}: MultiImageUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Solo se permiten archivos de imagen"
    }
    if (file.size > maxSizeBytes) {
      return `El archivo supera el limite de ${maxSizeMB}MB`
    }
    return null
  }

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const currentCount = files.length
      const availableSlots = maxFiles - currentCount

      if (availableSlots <= 0) {
        onError?.(`Ya tienes ${maxFiles} imagenes seleccionadas`)
        return
      }

      const filesToAdd = fileArray.slice(0, availableSlots)

      if (fileArray.length > availableSlots) {
        onError?.(
          `Solo se pueden agregar ${availableSlots} imagen(es) mas. Maximo ${maxFiles} en total.`
        )
      }

      const newFileItems: FileWithPreview[] = []

      filesToAdd.forEach((file) => {
        const error = validateFile(file)

        const fileItem: FileWithPreview = {
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
          status: error ? "error" : "pending",
          error: error || undefined,
        }
        newFileItems.push(fileItem)
      })

      setFiles((prev) => [...prev, ...newFileItems])
    },
    [files.length, maxFiles, maxSizeBytes, onError]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(e.target.files)
      }
      e.target.value = ""
    },
    [addFiles]
  )

  const uploadFiles = async () => {
    const validFiles = files.filter((f) => f.status === "pending")

    if (validFiles.length === 0) {
      onError?.("No hay imagenes validas para subir")
      return
    }

    setIsUploading(true)

    const uploadPromises = validFiles.map(async (fileItem) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: "uploading" as const } : f
        )
      )

      try {
        const url = await uploadImage(fileItem.file, folder)

        if (!url) {
          throw new Error("Error al subir")
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "success" as const, url }
              : f
          )
        )

        return { id: fileItem.id, url, success: true }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido"

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "error" as const, error: errorMessage }
              : f
          )
        )

        return { id: fileItem.id, success: false, error: errorMessage }
      }
    })

    const results = await Promise.all(uploadPromises)
    setIsUploading(false)

    const successfulUrls = results
      .filter((r) => r.success && r.url)
      .map((r) => r.url as string)

    if (successfulUrls.length > 0) {
      onUploadComplete(successfulUrls)
    }

    const failedCount = results.filter((r) => !r.success).length
    if (failedCount > 0) {
      onError?.(`${failedCount} imagen(es) fallaron al subir`)
    }
  }

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
  }

  const pendingCount = files.filter((f) => f.status === "pending").length
  const successCount = files.filter((f) => f.status === "success").length
  const errorCount = files.filter((f) => f.status === "error").length

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={isUploading}
        className={cn(
          "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-white transition-colors",
          isDragging
            ? "border-amber bg-amber/5"
            : "border-border hover:border-amber hover:bg-gray-50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <ImagePlus className="text-muted-foreground size-10" />
        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            Arrastra imagenes o haz clic para seleccionar
          </p>
          <p className="text-muted-foreground text-xs">
            JPG, PNG, WebP o GIF (max. {maxSizeMB}MB cada una, hasta {maxFiles}{" "}
            imagenes)
          </p>
        </div>
      </button>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {files.length} imagen(es) seleccionada(s)
              {pendingCount > 0 && ` · ${pendingCount} pendiente(s)`}
              {successCount > 0 && ` · ${successCount} subida(s)`}
              {errorCount > 0 && ` · ${errorCount} con error`}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isUploading}
              className="text-red-600 hover:text-red-700"
            >
              Limpiar todo
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="border-border group relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
              >
                <img
                  src={fileItem.preview}
                  alt="Preview"
                  className="size-full object-cover"
                />

                {/* Status overlay */}
                {fileItem.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="size-8 animate-spin text-white" />
                  </div>
                )}

                {fileItem.status === "success" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                    <CheckCircle className="size-8 text-white" />
                  </div>
                )}

                {fileItem.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                    <div className="p-2 text-center">
                      <AlertCircle className="mx-auto size-6 text-white" />
                      <p className="mt-1 line-clamp-2 text-xs text-white">
                        {fileItem.error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Remove button */}
                {!isUploading && fileItem.status !== "uploading" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(fileItem.id)
                    }}
                    className="absolute top-1 right-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <X className="size-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Upload button */}
          {pendingCount > 0 && (
            <Button
              type="button"
              onClick={uploadFiles}
              disabled={isUploading}
              className="bg-amber hover:bg-amber-dark w-full gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="size-5" />
                  Subir {pendingCount} imagen(es)
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

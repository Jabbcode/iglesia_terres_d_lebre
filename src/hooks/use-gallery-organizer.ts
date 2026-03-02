"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { GalleryImage, SpanType } from "@/components/admin/gallery-item"
import { ViewMode, FilterType } from "@/components/admin/gallery-toolbar"

interface UseGalleryOrganizerOptions {
  onDeleteImage: (id: string) => Promise<void>
}

interface UseGalleryOrganizerReturn {
  // State
  images: GalleryImage[]
  filteredImages: GalleryImage[]
  viewMode: ViewMode
  filter: FilterType
  changedIds: Set<string>
  pendingChanges: number
  isSaving: boolean
  isLoading: boolean
  hasUnsavedChanges: boolean

  // Actions
  setImages: (images: GalleryImage[]) => void
  setViewMode: (mode: ViewMode) => void
  setFilter: (filter: FilterType) => void
  handleReorder: (newImages: GalleryImage[]) => void
  handleSpanChange: (id: string, span: SpanType) => void
  handleToggleActive: (id: string) => void
  handleDelete: (id: string) => void
  handleSave: () => Promise<void>
  handleDiscard: () => void
  fetchImages: () => Promise<void>
}

export function useGalleryOrganizer({
  onDeleteImage,
}: UseGalleryOrganizerOptions): UseGalleryOrganizerReturn {
  // Original state from server
  const [originalImages, setOriginalImages] = useState<GalleryImage[]>([])

  // Current working state
  const [images, setImages] = useState<GalleryImage[]>([])

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filter, setFilter] = useState<FilterType>("all")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate changed IDs by comparing current state with original
  const changedIds = useMemo(() => {
    const changed = new Set<string>()

    images.forEach((img, index) => {
      const original = originalImages.find((o) => o.id === img.id)
      if (!original) return

      // Check if order changed (based on position in array)
      const originalIndex = originalImages.findIndex((o) => o.id === img.id)
      if (index !== originalIndex) {
        changed.add(img.id)
        return
      }

      // Check if span or activo changed
      if (img.span !== original.span || img.activo !== original.activo) {
        changed.add(img.id)
      }
    })

    return changed
  }, [images, originalImages])

  const pendingChanges = changedIds.size
  const hasUnsavedChanges = pendingChanges > 0

  // Filter images based on current filter
  const filteredImages = useMemo(() => {
    if (filter === "all") return images
    return images.filter((img) => img.span === filter)
  }, [images, filter])

  // Fetch images from server
  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/galeria")
      const data = await res.json()
      if (Array.isArray(data)) {
        setOriginalImages(data)
        setImages(data)
      }
    } catch (error) {
      console.error("Error fetching images:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle reordering from drag and drop
  const handleReorder = useCallback(
    (newImages: GalleryImage[]) => {
      // When filtered, we need to merge back with unfiltered images
      if (filter !== "all") {
        const filteredIds = new Set(newImages.map((img) => img.id))
        const unfilteredImages = images.filter(
          (img) => !filteredIds.has(img.id)
        )

        // Insert filtered images at their new positions
        const result: GalleryImage[] = []
        let filteredIndex = 0

        images.forEach((img) => {
          if (filteredIds.has(img.id)) {
            result.push(newImages[filteredIndex])
            filteredIndex++
          } else {
            result.push(img)
          }
        })

        setImages(result)
      } else {
        setImages(newImages)
      }
    },
    [images, filter]
  )

  // Handle span change
  const handleSpanChange = useCallback((id: string, span: SpanType) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, span } : img))
    )
  }, [])

  // Handle active toggle
  const handleToggleActive = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, activo: !img.activo } : img))
    )
  }, [])

  // Handle delete
  const handleDelete = useCallback(
    async (id: string) => {
      await onDeleteImage(id)
      setImages((prev) => prev.filter((img) => img.id !== id))
      setOriginalImages((prev) => prev.filter((img) => img.id !== id))
    },
    [onDeleteImage]
  )

  // Save all changes to server
  const handleSave = useCallback(async () => {
    if (pendingChanges === 0) return

    setIsSaving(true)
    try {
      // Build bulk update payload
      const items = images.map((img, index) => ({
        id: img.id,
        order: index,
        span: img.span,
        activo: img.activo,
      }))

      const res = await fetch("/api/admin/galeria/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (res.ok) {
        // Update original state to match current state
        setOriginalImages([...images])
      } else {
        console.error("Error saving changes")
      }
    } catch (error) {
      console.error("Error saving changes:", error)
    } finally {
      setIsSaving(false)
    }
  }, [images, pendingChanges])

  // Discard all changes
  const handleDiscard = useCallback(() => {
    setImages([...originalImages])
  }, [originalImages])

  // Initial fetch
  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return {
    images,
    filteredImages,
    viewMode,
    filter,
    changedIds,
    pendingChanges,
    isSaving,
    isLoading,
    hasUnsavedChanges,
    setImages,
    setViewMode,
    setFilter,
    handleReorder,
    handleSpanChange,
    handleToggleActive,
    handleDelete,
    handleSave,
    handleDiscard,
    fetchImages,
  }
}

"use client"

import { useConfirm } from "@/components/admin/confirm-dialog"

interface UseDeleteConfirmOptions {
  /** Title for the confirmation dialog */
  title: string
  /** Description for the confirmation dialog */
  description: string
  /** Function to execute the delete */
  onDelete: (id: string) => Promise<void>
  /** Callback on error (optional) */
  onError?: (error: unknown) => void
}

/**
 * Hook for handling delete with confirmation dialog
 * Reduces boilerplate for delete operations across admin pages
 */
export function useDeleteConfirm({
  title,
  description,
  onDelete,
  onError,
}: UseDeleteConfirmOptions) {
  const confirm = useConfirm()

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title,
      description,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    try {
      await onDelete(id)
    } catch (error) {
      if (onError) {
        onError(error)
      } else {
        console.error("Error deleting item:", error)
      }
    }
  }

  return { handleDelete }
}

import useSWR from "swr"
import { api } from "@/shared/api"

interface UseAdminDataOptions {
  endpoint: string
}

export function useAdminData<T extends { id: string }>({
  endpoint,
}: UseAdminDataOptions) {
  const { data = [], error, isLoading, mutate } = useSWR<T[]>(
    endpoint,
    (url: string) => api.get<T[]>(url)
  )

  /**
   * Optimistic toggle for boolean fields
   * Updates UI instantly and rolls back on error
   */
  const toggleField = async (
    id: string,
    field: keyof T,
    currentValue: boolean
  ) => {
    const previousData = data

    // Optimistic update - instant UI feedback
    mutate(
      data.map((item) =>
        item.id === id ? { ...item, [field]: !currentValue } : item
      ),
      false // Don't revalidate yet
    )

    try {
      await api.patch(`${endpoint}/${id}`, { [field]: !currentValue })
      // Success: keep the optimistic change
    } catch {
      // Error: rollback to previous state
      mutate(previousData, false)
      throw new Error("Error al actualizar")
    }
  }

  /**
   * Optimistic delete
   * Removes item instantly and rolls back on error
   */
  const deleteItem = async (id: string) => {
    const previousData = data

    // Optimistic delete
    mutate(
      data.filter((item) => item.id !== id),
      false
    )

    try {
      await api.delete(`${endpoint}/${id}`)
    } catch {
      // Rollback
      mutate(previousData, false)
      throw new Error("Error al eliminar")
    }
  }

  return {
    data,
    isLoading,
    error,
    mutate,
    toggleField,
    deleteItem,
  }
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Common filter for active/inactive items
 */
export interface ActiveFilter {
  activo?: boolean
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Make all properties optional except id
 */
export type UpdateInput<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>

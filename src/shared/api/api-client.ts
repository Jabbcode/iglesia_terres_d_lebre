import { ApiError } from "./api-error"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
  if (!params) return endpoint

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${endpoint}?${queryString}` : endpoint
}

/**
 * Make an HTTP request with automatic JSON handling and error throwing
 */
async function request<T>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers, ...rest } = options

  const url = buildUrl(endpoint, params)

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  // Handle no content responses
  if (res.status === 204) {
    return undefined as T
  }

  const data = await res.json()

  if (!res.ok) {
    throw new ApiError(res.status, data, data?.error)
  }

  return data as T
}

/**
 * Typed API client for making HTTP requests
 *
 * @example
 * // GET request
 * const eventos = await api.get<Evento[]>("/api/admin/eventos")
 *
 * // GET with query params
 * const eventos = await api.get<Evento[]>("/api/admin/eventos", {
 *   params: { activo: true }
 * })
 *
 * // POST request
 * const evento = await api.post<Evento>("/api/admin/eventos", {
 *   nombre: "Culto dominical",
 *   fecha: "2024-01-01"
 * })
 *
 * // PATCH request
 * const updated = await api.patch<Evento>("/api/admin/eventos/123", {
 *   nombre: "Nuevo nombre"
 * })
 *
 * // DELETE request
 * await api.delete("/api/admin/eventos/123")
 */
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "body">) =>
    request<T>("GET", endpoint, options),

  post: <T>(
    endpoint: string,
    body: unknown,
    options?: Omit<RequestOptions, "body">
  ) => request<T>("POST", endpoint, { ...options, body }),

  put: <T>(
    endpoint: string,
    body: unknown,
    options?: Omit<RequestOptions, "body">
  ) => request<T>("PUT", endpoint, { ...options, body }),

  patch: <T>(
    endpoint: string,
    body: unknown,
    options?: Omit<RequestOptions, "body">
  ) => request<T>("PATCH", endpoint, { ...options, body }),

  delete: <T = void>(
    endpoint: string,
    options?: Omit<RequestOptions, "body">
  ) => request<T>("DELETE", endpoint, options),
}

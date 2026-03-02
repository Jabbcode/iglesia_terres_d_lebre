export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message?: string
  ) {
    super(message || `API Error: ${status}`)
    this.name = "ApiError"
  }

  get isValidationError() {
    return this.status === 400
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }

  get isNotFound() {
    return this.status === 404
  }

  get isServerError() {
    return this.status >= 500
  }
}

export interface ApiErrorResponse {
  error: string
  details?: unknown
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

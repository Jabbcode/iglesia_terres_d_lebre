"use client"

import { ReactNode } from "react"

interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}

export function FormField({
  label,
  error,
  hint,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-foreground mb-1 block text-sm font-medium"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

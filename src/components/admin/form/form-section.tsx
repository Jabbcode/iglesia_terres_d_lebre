"use client"

import { ReactNode } from "react"

interface FormSectionProps {
  children: ReactNode
  title?: string
}

export function FormSection({ children, title }: FormSectionProps) {
  return (
    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
      {title && (
        <h2 className="text-foreground mb-4 text-lg font-semibold">{title}</h2>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  )
}

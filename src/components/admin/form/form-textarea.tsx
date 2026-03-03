"use client"

import { forwardRef, TextareaHTMLAttributes } from "react"
import { FormField } from "./form-field"
import { cn } from "@/lib/utils"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || props.name
    return (
      <FormField label={label} error={error} hint={hint} htmlFor={textareaId}>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none",
            error && "border-red-500",
            className
          )}
          {...props}
        />
      </FormField>
    )
  }
)

FormTextarea.displayName = "FormTextarea"

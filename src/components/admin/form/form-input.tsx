"use client"

import { forwardRef, InputHTMLAttributes } from "react"
import { FormField } from "./form-field"
import { cn } from "@/lib/utils"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <FormField label={label} error={error} hint={hint} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
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

FormInput.displayName = "FormInput"

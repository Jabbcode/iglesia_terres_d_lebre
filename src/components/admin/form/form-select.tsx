"use client"

import { forwardRef, SelectHTMLAttributes } from "react"
import { FormField } from "./form-field"
import { cn } from "@/lib/utils"

interface FormSelectOption {
  value: string
  label: string
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  options: readonly FormSelectOption[] | readonly string[]
  placeholder?: string
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, error, hint, options, placeholder, className, id, ...props },
    ref
  ) => {
    const selectId = id || props.name
    return (
      <FormField label={label} error={error} hint={hint} htmlFor={selectId}>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => {
            const isString = typeof option === "string"
            const value = isString ? option : option.value
            const optionLabel = isString ? option : option.label
            return (
              <option key={value} value={value}>
                {optionLabel}
              </option>
            )
          })}
        </select>
      </FormField>
    )
  }
)

FormSelect.displayName = "FormSelect"

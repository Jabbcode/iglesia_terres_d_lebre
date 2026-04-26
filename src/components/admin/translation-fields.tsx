"use client"

import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { ChevronDown, ChevronRight, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface TranslationFieldsProps {
  lang: "ca" | "en"
  langName: string
  fields: {
    name: string
    label: string
    type?: "text" | "textarea"
    rows?: number
    placeholder?: string
    register: UseFormRegisterReturn
  }[]
}

export function TranslationFields({
  lang,
  langName,
  fields,
}: TranslationFieldsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-border/50 rounded-xl border bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <Globe className="text-amber size-5" />
          <div>
            <h3 className="text-foreground font-semibold">
              Traducción - {langName}
            </h3>
            <p className="text-muted-foreground text-sm">
              Campos traducidos al {langName.toLowerCase()} (opcional)
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="text-muted-foreground size-5" />
        ) : (
          <ChevronRight className="text-muted-foreground size-5" />
        )}
      </button>

      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr] p-4 pt-0" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    {...field.register}
                    rows={field.rows || 3}
                    placeholder={field.placeholder}
                    className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                  />
                ) : (
                  <input
                    {...field.register}
                    type="text"
                    placeholder={field.placeholder}
                    className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

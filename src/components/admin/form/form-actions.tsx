"use client"

import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FormActionsProps {
  cancelHref: string
  submitLabel: string
  submittingLabel?: string
  isSubmitting?: boolean
}

export function FormActions({
  cancelHref,
  submitLabel,
  submittingLabel = "Guardando...",
  isSubmitting = false,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Link href={cancelHref}>
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </Link>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-amber hover:bg-amber-dark gap-2"
      >
        <Save className="size-4" />
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  )
}

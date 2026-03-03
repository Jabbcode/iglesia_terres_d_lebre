"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FormHeaderProps {
  title: string
  description: string
  backHref: string
  backLabel: string
}

export function FormHeader({
  title,
  description,
  backHref,
  backLabel,
}: FormHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>
      <h1 className="text-foreground text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

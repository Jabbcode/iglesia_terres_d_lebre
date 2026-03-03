"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminListHeaderProps {
  title: string
  description: string
  createHref: string
  createLabel: string
}

export function AdminListHeader({
  title,
  description,
  createHref,
  createLabel,
}: AdminListHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <Link href={createHref}>
        <Button className="bg-amber hover:bg-amber-dark gap-2">
          <Plus className="size-4" />
          {createLabel}
        </Button>
      </Link>
    </div>
  )
}

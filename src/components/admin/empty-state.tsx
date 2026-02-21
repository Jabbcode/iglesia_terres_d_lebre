"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type EmptyStateVariant =
  | "galeria"
  | "eventos"
  | "comunidad"
  | "horarios"
  | "testimonios"

interface EmptyStateProps {
  variant: EmptyStateVariant
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

function GaleriaIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber"
    >
      <rect
        x="15"
        y="25"
        width="90"
        height="70"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <rect
        x="25"
        y="35"
        width="70"
        height="50"
        rx="6"
        fill="currentColor"
        opacity="0.1"
      />
      <circle cx="45" cy="52" r="8" fill="currentColor" opacity="0.4" />
      <path
        d="M25 75 L45 55 L60 70 L75 50 L95 75 L95 79 C95 82.3137 92.3137 85 89 85 L31 85 C27.6863 85 25 82.3137 25 79 L25 75Z"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="20"
        y="30"
        width="80"
        height="60"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="40" cy="50" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 70 L40 50 L55 65 L70 45 L100 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EventosIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber"
    >
      <rect
        x="20"
        y="30"
        width="80"
        height="70"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <rect
        x="25"
        y="35"
        width="70"
        height="60"
        rx="6"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="25"
        y="25"
        width="70"
        height="65"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M25 45 L95 45" stroke="currentColor" strokeWidth="2" />
      <rect x="35" y="15" width="4" height="20" rx="2" fill="currentColor" />
      <rect x="81" y="15" width="4" height="20" rx="2" fill="currentColor" />
      <circle cx="45" cy="60" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="60" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="75" cy="60" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="45" cy="75" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="75" r="4" fill="currentColor" />
      <circle cx="75" cy="75" r="4" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function ComunidadIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber"
    >
      <circle
        cx="60"
        cy="45"
        r="25"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <circle cx="60" cy="42" r="12" fill="currentColor" opacity="0.2" />
      <circle
        cx="60"
        cy="40"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M35 95 C35 75 45 65 60 65 C75 65 85 75 85 95"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="55" r="7" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path
        d="M12 95 C12 80 20 72 30 72 C35 72 39 74 42 77"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="90" cy="55" r="7" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path
        d="M108 95 C108 80 100 72 90 72 C85 72 81 74 78 77"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

function HorariosIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber"
    >
      <circle
        cx="60"
        cy="60"
        r="45"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <circle cx="60" cy="60" r="38" fill="currentColor" opacity="0.1" />
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="60" cy="60" r="3" fill="currentColor" />
      <path
        d="M60 35 L60 60"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M60 60 L78 72"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="28" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="92" cy="60" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="92" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="60" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

function TestimoniosIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber"
    >
      <path
        d="M25 35 L95 35 C98.3137 35 101 37.6863 101 41 L101 75 C101 78.3137 98.3137 81 95 81 L45 81 L30 96 L30 81 L25 81 C21.6863 81 19 78.3137 19 75 L19 41 C19 37.6863 21.6863 35 25 35Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <path
        d="M20 30 L90 30 C93.3137 30 96 32.6863 96 36 L96 66 C96 69.3137 93.3137 72 90 72 L40 72 L25 87 L25 72 L20 72 C16.6863 72 14 69.3137 14 66 L14 36 C14 32.6863 16.6863 30 20 30Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M20 25 L90 25 C93.3137 25 96 27.6863 96 31 L96 61 C96 64.3137 93.3137 67 90 67 L40 67 L25 82 L25 67 L20 67 C16.6863 67 14 64.3137 14 61 L14 31 C14 27.6863 16.6863 25 20 25Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="35" cy="46" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="55" cy="46" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="75" cy="46" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

const illustrations: Record<EmptyStateVariant, React.FC> = {
  galeria: GaleriaIllustration,
  eventos: EventosIllustration,
  comunidad: ComunidadIllustration,
  horarios: HorariosIllustration,
  testimonios: TestimoniosIllustration,
}

export function EmptyState({
  variant,
  title,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  const Illustration = illustrations[variant]

  return (
    <div className="border-border/50 flex flex-col items-center justify-center rounded-xl border bg-white p-12 shadow-sm">
      <Illustration />
      <h3 className="text-foreground mt-6 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
        {description}
      </p>
      <Link href={ctaHref} className="mt-6">
        <Button className="bg-amber hover:bg-amber-dark gap-2">
          <Plus className="size-4" />
          {ctaLabel}
        </Button>
      </Link>
    </div>
  )
}

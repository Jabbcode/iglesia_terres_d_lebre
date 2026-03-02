"use client"

import {
  Square,
  RectangleVertical,
  RectangleHorizontal,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SpanType = "normal" | "tall" | "wide"

interface SpanSelectorProps {
  value: SpanType
  onChange: (value: SpanType) => void
  disabled?: boolean
}

const spanOptions: {
  value: SpanType
  label: string
  icon: React.ElementType
}[] = [
  { value: "normal", label: "Normal", icon: Square },
  { value: "tall", label: "Vertical", icon: RectangleVertical },
  { value: "wide", label: "Horizontal", icon: RectangleHorizontal },
]

export function SpanSelector({ value, onChange, disabled }: SpanSelectorProps) {
  const currentOption =
    spanOptions.find((opt) => opt.value === value) || spanOptions[0]
  const Icon = currentOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-7 gap-1.5 px-2 text-xs"
        >
          <Icon className="size-3.5" />
          <span className="hidden sm:inline">{currentOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {spanOptions.map((option) => {
          const OptionIcon = option.icon
          const isSelected = option.value === value
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-center gap-2",
                isSelected && "bg-amber/10"
              )}
            >
              <OptionIcon className="size-4" />
              <span className="flex-1">{option.label}</span>
              {isSelected && <Check className="text-amber size-3.5" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

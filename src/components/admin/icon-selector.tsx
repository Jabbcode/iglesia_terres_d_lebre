"use client"

import {
  Church,
  BookOpen,
  HeartHandshake,
  Users,
  Smile,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
  Calendar,
  type LucideIcon,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const iconOptions: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "Church", label: "Iglesia", icon: Church },
  { value: "BookOpen", label: "Biblia", icon: BookOpen },
  { value: "HeartHandshake", label: "Comunion", icon: HeartHandshake },
  { value: "Users", label: "Comunidad", icon: Users },
  { value: "Smile", label: "Ninos", icon: Smile },
  { value: "Music", label: "Musica", icon: Music },
  { value: "Mic2", label: "Predicacion", icon: Mic2 },
  { value: "Sun", label: "Manana", icon: Sun },
  { value: "Moon", label: "Noche", icon: Moon },
  { value: "Star", label: "Especial", icon: Star },
  { value: "Calendar", label: "Evento", icon: Calendar },
]

interface IconSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function IconSelector({ value, onValueChange }: IconSelectorProps) {
  const selectedIcon = iconOptions.find((opt) => opt.value === value)
  const SelectedIconComponent = selectedIcon?.icon || Calendar

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="border-border focus:border-amber w-full bg-white">
        <SelectValue>
          <span className="flex items-center gap-2">
            <SelectedIconComponent className="text-amber size-4" />
            <span>{selectedIcon?.label || "Seleccionar"}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {iconOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                <IconComponent className="text-amber size-4" />
                <span>{option.label}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export { iconOptions }

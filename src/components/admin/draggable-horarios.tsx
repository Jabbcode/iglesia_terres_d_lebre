"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import type { Horario } from "@/modules/horarios"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface SortableItemProps {
  id: string
  horario: Horario
  getIcon: (iconName: string) => React.ReactNode
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggle: (id: string, currentValue: boolean) => void
}

function SortableItem({
  id,
  horario,
  getIcon,
  onEdit,
  onDelete,
  onToggle,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-border/50 rounded-lg border bg-white shadow-sm transition-all ${
        isDragging ? "ring-2 ring-amber opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            {...listeners}
            {...attributes}
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing flex-shrink-0"
            title="Arrastra para reordenar"
          >
            <GripVertical className="size-5" />
          </button>

          <div className="bg-amber/10 text-amber flex size-12 items-center justify-center rounded-lg flex-shrink-0">
            {getIcon(horario.icono)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-semibold truncate">
              {horario.titulo}
            </h3>
            <p className="text-muted-foreground text-sm">
              {horario.dia} - {horario.hora}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Switch
            checked={horario.activo}
            onCheckedChange={() => onToggle(horario.id, horario.activo)}
            className="cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(horario.id)}
              className="text-amber hover:bg-amber/10 hover:text-amber cursor-pointer"
              title="Editar"
            >
              <Edit className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(horario.id)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              title="Eliminar"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DraggableHorariosProps {
  horarios: Horario[]
  isLoading: boolean
  getIcon: (iconName: string) => React.ReactNode
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggle: (id: string, currentValue: boolean) => void
  onReorder: (newOrder: Horario[]) => Promise<void>
}

export function DraggableHorarios({
  horarios,
  isLoading,
  getIcon,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
}: DraggableHorariosProps) {
  const [items, setItems] = useState(horarios)
  const [saving, setSaving] = useState(false)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Only resync when count changes (add/remove) to avoid overwriting pending local drag state
    if (items.length !== horarios.length) {
      setItems(horarios)
    }
  }, [horarios.length])
  /* eslint-enable react-hooks/exhaustive-deps */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleToggleLocal = (id: string, currentValue: boolean) => {
    // Update local state with the toggled value for optimistic UI
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, activo: !currentValue } : item
      )
    )
    onToggle(id, currentValue)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      // Actualizar los órdenes y guardar
      setSaving(true)
      try {
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }))
        await onReorder(updatedItems)
      } catch (error) {
        // Revertir si falla
        setItems(horarios)
        console.error("Error al reordenar:", error)
      } finally {
        setSaving(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-border/50 h-20 rounded-lg border bg-white animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)}>
        <div className="space-y-3">
          {items.map((horario) => (
            <SortableItem
              key={horario.id}
              id={horario.id}
              horario={horario}
              getIcon={getIcon}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={handleToggleLocal}
            />
          ))}
        </div>
      </SortableContext>
      {saving && (
        <div className="mt-4 text-center text-sm text-amber-600">
          Guardando cambios...
        </div>
      )}
    </DndContext>
  )
}

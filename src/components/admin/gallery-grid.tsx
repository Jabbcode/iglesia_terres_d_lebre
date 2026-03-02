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
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { GalleryItem, GalleryImage, SpanType } from "./gallery-item"

interface GalleryGridProps {
  images: GalleryImage[]
  changedIds: Set<string>
  onReorder: (images: GalleryImage[]) => void
  onSpanChange: (id: string, span: SpanType) => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

export function GalleryGrid({
  images,
  changedIds,
  onReorder,
  onSpanChange,
  onToggleActive,
  onDelete,
  disabled,
}: GalleryGridProps) {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      const reordered = arrayMove(images, oldIndex, newIndex)
      onReorder(reordered)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {images.map((image) => (
            <GalleryItem
              key={image.id}
              image={image}
              hasChanges={changedIds.has(image.id)}
              onSpanChange={(span) => onSpanChange(image.id, span)}
              onToggleActive={() => onToggleActive(image.id)}
              onDelete={() => onDelete(image.id)}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

// Re-export Prisma types
export type { Imagen, ImageSpan } from "@prisma/client"

// Re-export Zod input types
export type {
  CreateImagenInput,
  UpdateImagenInput,
  BulkCreateInput,
  BulkUpdateInput,
} from "./imagen.schema"

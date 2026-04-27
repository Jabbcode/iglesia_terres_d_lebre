import type { Testimonio as PrismaTestimonio, TestimonioTranslation } from "@prisma/client"
export type { CreateTestimonioInput, UpdateTestimonioInput } from "./testimonio.schema"

export type Testimonio = PrismaTestimonio & {
  translations: TestimonioTranslation[]
}

import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export async function generateUniqueSlug(
  title: string,
  model: "articulo" | "evento",
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const where: Record<string, unknown> = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    let existing: unknown;
    if (model === "articulo") {
      existing = await prisma.articulo.findFirst({ where: where as { slug: string; id?: { not: string } } });
    } else {
      existing = await prisma.evento.findFirst({ where: where as { slug: string; id?: { not: string } } });
    }

    if (!existing) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

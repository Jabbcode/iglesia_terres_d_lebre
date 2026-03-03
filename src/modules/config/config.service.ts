import { prisma } from "@/lib/prisma"
import type { UpdateConfigInput } from "./config.schema"

const DEFAULT_ID = "default"

export const configService = {
  async get() {
    let config = await prisma.configSitio.findUnique({
      where: { id: DEFAULT_ID },
    })

    if (!config) {
      config = await prisma.configSitio.create({
        data: { id: DEFAULT_ID },
      })
    }

    return config
  },

  async update(data: UpdateConfigInput) {
    return prisma.configSitio.upsert({
      where: { id: DEFAULT_ID },
      update: data,
      create: { id: DEFAULT_ID, ...data },
    })
  },
}

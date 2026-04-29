import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { REVALIDATE_24H } from "@/lib/constants/cache"
import type { UpdateConfigInput } from "./config.schema"

const DEFAULT_ID = "default"

const getConfigCached = unstable_cache(
  async () => {
    const config = await prisma.configSitio.findUnique({
      where: { id: DEFAULT_ID },
    })
    return config
  },
  ["config-public"],
  { tags: ["config"], revalidate: REVALIDATE_24H }
)

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

  async getPublicCached() {
    return getConfigCached()
  },

  async update(data: UpdateConfigInput) {
    return prisma.configSitio.upsert({
      where: { id: DEFAULT_ID },
      update: data,
      create: { id: DEFAULT_ID, ...data },
    })
  },
}

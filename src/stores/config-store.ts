import { create } from "zustand"
import { api } from "@/shared/api"

interface ConfigSitio {
  nombreIglesia: string
  descripcion: string | null
  videoHero: string
  instagram: string | null
  facebook: string | null
  youtube: string | null
  direccion: string | null
  telefono: string | null
  email: string | null
  horarioAtencion: string | null
  googleMapsUrl: string | null
  googleMapsEmbed: string | null
}

interface ConfigStore {
  config: ConfigSitio | null
  loading: boolean
  fetched: boolean
  fetchConfig: () => Promise<void>
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  loading: false,
  fetched: false,

  fetchConfig: async () => {
    // Si ya se cargó, no volver a hacer la petición
    if (get().fetched) return

    set({ loading: true })

    try {
      const data = await api.get<ConfigSitio>("/api/public/config")
      set({ config: data, loading: false, fetched: true })
    } catch {
      set({ loading: false, fetched: true })
    }
  },
}))

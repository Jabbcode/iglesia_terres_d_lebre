import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/modules/**", "src/shared/**"],
      exclude: [
        "src/lib/prisma.ts",
        "src/lib/supabase.ts",
        "src/**/*.types.ts",
        "src/**/index.ts",
      ],
    },
  },
})

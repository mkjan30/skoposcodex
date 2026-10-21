import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": src("./src"),
      // "server-only" throws outside Next's server bundle; tests run server code directly.
      "server-only": src("./src/test/empty-module.ts"),
    },
  },
  test: { include: ["src/**/*.test.ts"] },
});

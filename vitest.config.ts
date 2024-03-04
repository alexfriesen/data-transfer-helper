import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ["src"],
      exclude: ["src/testing.ts"],
    },
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    include: ["./src/**/*.spec.ts"],
    exclude: [],
  },
});

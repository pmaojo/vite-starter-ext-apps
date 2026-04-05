/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath } from "node:url";

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const INPUT = process.env.INPUT;
if (
  !INPUT &&
  !process.argv.includes("storybook") &&
  !process.argv.includes("build-storybook") &&
  !process.env.STORYBOOK &&
  process.env.NODE_ENV !== "test" &&
  !process.env.VITEST
) {
  throw new Error("INPUT environment variable is not set");
}
const isDevelopment = process.env.NODE_ENV === "development";
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/**/*.test.{ts,tsx}", "src/shared/components/ui/**", "src/stories/**", "src/tools/**/view.tsx", "src/tools/**/components/**", "src/tools/**/libs/**", "src/tools/**/pages/**", "src/tools/**/index.ts", "src/tools/**/*.tsx", "src/guia-diseno/**", "src/shared/hooks/**", "src/core/framework/**", "src/types/**"],
      reporter: ["text", "json", "html"],
    },
  },
  build: {
    sourcemap: isDevelopment ? "inline" : undefined,
    cssMinify: !isDevelopment,
    minify: !isDevelopment,
    rollupOptions: {
      input: INPUT,
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});

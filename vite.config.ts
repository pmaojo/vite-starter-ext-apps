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

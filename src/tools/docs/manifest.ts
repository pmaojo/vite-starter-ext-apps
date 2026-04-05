import type { ToolManifest } from "@/core/framework/tool-contract";
import { DocsView } from "./view";

export const docsManifest: ToolManifest = {
  slug: "view-docs",
  title: "API Documentation",
  version: "1.0.0",
  component: DocsView,
};
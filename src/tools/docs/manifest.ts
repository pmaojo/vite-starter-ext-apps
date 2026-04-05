import type { ToolManifest } from "@/core/framework/tool-contract";
import { DocsView } from "./view";

export const docsManifest: ToolManifest = {
  slug: "view-docs",
  title: "API Documentation",
  description: "View the statically generated TypeDoc API documentation in an interactive UI.",
  version: "1.0.0",
  component: DocsView,
};
import { ToolManifest } from "@/core/framework/tool-contract";
import { ViewDocsTool } from "./view";

/**
 * Manifest for the View Docs tool.
 *
 * @description
 * This tool renders an iframe that displays the generated JSDoc/Typedoc documentation.
 */
export const viewDocsManifest: ToolManifest = {
  slug: "view-docs",
  title: "View Documentation",
  version: "1.0.0",
  component: ViewDocsTool,
  config: {
    isExperimental: false,
    requiresConfig: false,
  },
};

import type { ToolManifest } from "@/core/framework/tool-contract";
import { FileExplorerView } from "./view";

export const fileExplorerManifest: ToolManifest = {
  slug: "list-files",
  title: "Sandbox File Explorer",
  description: "A tool to securely explore files in the sandbox directory.",
  version: "1.0.0",
  component: FileExplorerView,
  config: {
    requiredPermissions: ['callServerTool']
  }
};

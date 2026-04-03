/**
 * @file Sandbox File Explorer Tool Manifest
 *
 * @description
 * Declares the File Explorer tool metadata.
 * Notice how `slug: "list-files"` strictly maps to the server-side registration
 * `registerAppTool(server, "list-files", ...)` in `server.ts`.
 * This tool implementation demonstrates complex server-client interactions requiring
 * the `callServerTool` permission.
 */
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

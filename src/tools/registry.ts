/**
 * @file Central Tool Registry
 *
 * @description
 * This registry acts as the central hub for the Micro-Manifest Architecture.
 * It aggregates individual tool manifests into a single lookup record.
 *
 * Architectural Note:
 * Dynamic imports (`React.lazy()`) are intentionally avoided here. While lazy loading
 * can reduce initial bundle size, statically importing manifests ensures robust type-checking,
 * simplifies the Vite build process for the MCP environment, and avoids asynchronous rendering
 * complexities during initial host injection.
 */

import type { ToolManifest } from "../core/framework/tool-contract";
import { getTimeManifest } from "./get-time/manifest";
import { hostBridgeManifest } from "./host-bridge/manifest";
import { fileExplorerManifest } from "./file-explorer/manifest";
import { learnMcpManifest } from "./learn-mcp/manifest";
import { princeJsManifest } from "./prince-js/manifest";

/**
 * Array of all actively registered tool manifests.
 */
const manifests: ToolManifest[] = [
  getTimeManifest,
  hostBridgeManifest,
  fileExplorerManifest,
  learnMcpManifest,
  princeJsManifest,
];

/**
 * Record mapping a tool's unique slug (the server-side `toolName`) to its React UI component.
 *
 * @description
 * Used by the main router (`AppContent` in `mcp-app.tsx`) to dynamically resolve and render
 * the correct component based on the host's contextual injection.
 */
export const TOOL_COMPONENTS: Record<string, ToolManifest["component"]> = manifests.reduce(
  (acc, manifest) => {
    acc[manifest.slug] = manifest.component;
    return acc;
  },
  {} as Record<string, ToolManifest["component"]>
);

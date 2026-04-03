import type { ToolManifest } from "../core/framework/tool-contract";
import { getTimeManifest } from "./get-time/manifest";
import { hostBridgeManifest } from "./host-bridge/manifest";
import { fileExplorerManifest } from "./file-explorer/manifest";

const manifests: ToolManifest[] = [
  getTimeManifest,
  hostBridgeManifest,
  fileExplorerManifest,
];

export const TOOL_COMPONENTS: Record<string, ToolManifest["component"]> = manifests.reduce(
  (acc, manifest) => {
    acc[manifest.slug] = manifest.component;
    return acc;
  },
  {} as Record<string, ToolManifest["component"]>
);

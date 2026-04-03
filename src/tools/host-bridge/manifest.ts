import type { ToolManifest } from "@/core/framework/tool-contract";
import { HostBridgeView } from "./view";

export const hostBridgeManifest: ToolManifest = {
  slug: "host-bridge",
  title: "Host Bridge",
  description: "A demonstration tool showcasing MCP SDK client capabilities like sendMessage, sendLog, and openLink.",
  version: "1.0.0",
  component: HostBridgeView,
  config: {
    requiredPermissions: ['sendMessage', 'sendLog', 'openLink']
  }
};

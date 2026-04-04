import type { ToolManifest } from "@/core/framework/tool-contract";
import { LearnMcpView } from "./view";

export const learnMcpManifest: ToolManifest = {
  slug: "learn-mcp",
  title: "Learn MCP Ext-Apps",
  description: "An interactive mobile-first responsive learning experience covering modelcontextprotocol/ext-apps documentation with gamification.",
  version: "1.0.0",
  component: LearnMcpView,
  config: {
    requiredPermissions: []
  }
};

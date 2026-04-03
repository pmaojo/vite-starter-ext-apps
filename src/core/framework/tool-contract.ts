import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface ToolComponentProps {
  app: App | null;
  toolResult: CallToolResult | null;
  hostContext?: McpUiHostContext;
}

export interface ToolManifest {
  slug: string;
  title: string;
  description: string;
  version: string;
  component: React.ComponentType<ToolComponentProps>;
  config?: {
    isExperimental?: boolean;
    requiredPermissions?: Array<'sendMessage' | 'sendLog' | 'openLink' | 'callServerTool'>;
  };
}

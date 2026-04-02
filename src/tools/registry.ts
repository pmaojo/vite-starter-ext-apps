import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GetTimeTool } from "./GetTimeTool";

export interface ToolComponentProps {
  app: App | null;
  toolResult: CallToolResult | null;
  hostContext?: McpUiHostContext;
}

export const TOOL_COMPONENTS: Record<string, React.ComponentType<ToolComponentProps>> = {
  "get-time": GetTimeTool,
};

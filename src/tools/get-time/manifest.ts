import type { ToolManifest } from "@/core/framework/tool-contract";
import { GetTimeTool } from "./view";

export const getTimeManifest: ToolManifest = {
  slug: "get-time",
  title: "Get Time",
  description: "Returns the current server time as an ISO 8601 string.",
  version: "1.0.0",
  component: GetTimeTool,
  config: {
    requiredPermissions: ["callServerTool"],
  },
};

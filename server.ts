import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

/**
 * Common configuration logic to setup tools and resources on any given server instance.
 */
function configureServer(server: McpServer) {
  // Two-part registration: tool + resource, tied together by the resource URI.
  const resourceUri = "ui://get-time/mcp-app.html";

  // Register a tool with UI metadata. When the host calls this tool, it reads
  // `_meta.ui.resourceUri` to know which resource to fetch and render as an
  // interactive UI.
  registerAppTool(server,
    "get-time",
    {
      title: "Get Time",
      description: "Returns the current server time as an ISO 8601 string.",
      inputSchema: z.object({}),
      _meta: { ui: { resourceUri } }, // Links this tool to its UI resource
    },
    async (): Promise<CallToolResult> => {
      const time = new Date().toISOString();
      return { content: [{ type: "text", text: time }] };
    },
  );

  registerAppTool(server,
    "host-bridge",
    {
      title: "Host Bridge",
      description: "Demonstrates frontend SDK capabilities like sendMessage, sendLog, and openLink.",
      inputSchema: z.object({}),
      _meta: { ui: { resourceUri } },
    },
    async (): Promise<CallToolResult> => {
      return { content: [{ type: "text", text: "Host Bridge initialized. Please interact with the UI." }] };
    },
  );

  // File Explorer Tool
  // This demonstrates a server-side capability that the frontend can call via callServerTool
  registerAppTool(server,
    "list-files",
    {
      title: "List Files",
      description: "Lists files in the sandbox directory.",
      inputSchema: z.object({
        subpath: z.string().optional().describe("Optional subpath within the sandbox to list."),
      }),
      _meta: { ui: { resourceUri } },
    },
    async (request: any): Promise<CallToolResult> => {
      const sandboxDir = path.resolve(process.cwd(), "mcp-sandbox");
      const requestSubpath = request.params?.arguments?.subpath as string || "";
      const targetPath = path.resolve(sandboxDir, requestSubpath);

      // Security check: strictly validate the path starts with sandboxDir
      if (!targetPath.startsWith(sandboxDir)) {
         return {
           isError: true,
           content: [{ type: "text", text: "Security Error: Path traversal detected. Access denied." }]
         };
      }

      try {
        const stats = await fs.stat(targetPath);
        if (!stats.isDirectory()) {
          return {
             isError: true,
             content: [{ type: "text", text: "Error: Target is not a directory." }]
          };
        }

        const entries = await fs.readdir(targetPath, { withFileTypes: true });
        const files = entries.map(entry => ({
          name: entry.name,
          isDirectory: entry.isDirectory(),
          path: path.relative(sandboxDir, path.join(targetPath, entry.name))
        }));

        return { content: [{ type: "text", text: JSON.stringify(files) }] };
      } catch (error: any) {
        return {
           isError: true,
           content: [{ type: "text", text: `Error reading directory: ${error.message}` }]
        };
      }
    },
  );

  // Infer the base URL from Vercel environment variables, or fallback to localhost
  const protocol = process.env.VERCEL_URL ? "https" : "http";
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || `localhost:${process.env.PORT || 3001}`;
  const baseURL = `${protocol}://${host}`;

  // Register the resource, which returns the bundled HTML/JavaScript for the UI.
  registerAppResource(server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      let htmlPath = path.join(DIST_DIR, "mcp-app.html");
      try {
        await fs.access(htmlPath);
      } catch {
        // Fallback for Vercel environments where process.cwd() might point to the root
        htmlPath = path.join(process.cwd(), "dist", "mcp-app.html");
      }
      const html = await fs.readFile(htmlPath, "utf-8");
      return {
        contents: [{
          uri: resourceUri,
          mimeType: RESOURCE_MIME_TYPE,
          text: html,
          _meta: {
            ui: {
              csp: {
                connectDomains: [baseURL],
                resourceDomains: [baseURL],
              },
            },
          },
        }],
      };
    },
  );
}

/**
 * Creates a new MCP server instance with tools and resources registered.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Basic MCP App Server (React)",
    version: "1.0.0",
  });

  configureServer(server);
  return server;
}

// Re-export standard handler for integration
export const mcpHandler = createMcpHandler(async (server: McpServer) => {
    configureServer(server);
}, {
  serverInfo: {
    name: "Basic MCP App Server (React)",
    version: "1.0.0",
  }
});

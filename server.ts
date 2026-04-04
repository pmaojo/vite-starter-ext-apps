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
 * Core server configuration and tool registration for the MCP application.
 *
 * @description
 * This module is the entry point for configuring the Model Context Protocol (MCP) server.
 * It demonstrates how to properly integrate `@modelcontextprotocol/sdk` and `@modelcontextprotocol/ext-apps/server`
 * to provide both raw tool logic and an interactive User Interface.
 *
 * Key Architectural Concepts demonstrated here:
 * 1. **Resource Registration:** The React UI bundled via Vite is served directly to the MCP host as an MCP Resource.
 * 2. **Tool Registration with UI Metadata:** By supplying `_meta.ui.resourceUri`, we signal to the host that
 *    a specific tool has an associated frontend component, allowing the host to render the interactive React UI
 *    when the tool is invoked by an LLM.
 * 3. **Schema Validation:** Zod (`z.object`) is strictly used for defining `inputSchema`. This ensures type-safe
 *    arguments from the LLM and guarantees compatibility with internal SDK validators.
 *
 * Note: The implementations provided (`get-time`, `host-bridge`, `list-files`) are didactic examples designed
 * to guide developers on structuring robust, production-ready MCP applications.
 *
 * @param {McpServer} server - The core MCP server instance to be configured.
 */
function configureServer(server: McpServer) {
  // Two-part registration: tool + resource, tied together by the resource URI.
  const resourceUri = "ui://main/mcp-app.html";

  /**
   * ThreeJS Tetris Tool.
   *
   * @description
   * Play the classic Tetris game in 3D in the UI.
   */
  registerAppTool(server,
    "threejs-tetris",
    {
      title: "ThreeJS Tetris",
      description: "Play the classic Tetris game in 3D.",
      inputSchema: z.object({}),
      _meta: { ui: { resourceUri } },
    },
    async (): Promise<CallToolResult> => {
      return { content: [{ type: "text", text: "ThreeJS Tetris initialized. Play the game in the UI." }] };
    },
  );

  /**
   * Register a tool with UI metadata.
   *
   * @description
   * When the host calls this tool, it reads the `_meta.ui.resourceUri` to know
   * which resource to fetch and render as an interactive UI.
   * This specific tool is for demo purposes to show how to retrieve server state.
   */
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

  /**
   * Register the Host Bridge tool.
   *
   * @description
   * This demo tool illustrates how the frontend can communicate back to the host.
   * Capabilities demonstrated include `sendMessage`, `sendLog`, `openLink`,
   * `downloadFile`, `requestTeardown`, and `requestDisplayMode`.
   */
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

  /**
   * Register the Learn MCP Ext-Apps tool.
   *
   * @description
   * A gamified interactive learning tool for the MCP Ext-Apps SDK.
   */
  registerAppTool(server,
    "learn-mcp",
    {
      title: "Learn MCP Ext-Apps",
      description: "An interactive mobile-first responsive learning experience covering modelcontextprotocol/ext-apps documentation with gamification.",
      inputSchema: z.object({}),
      _meta: { ui: { resourceUri } },
    },
    async (): Promise<CallToolResult> => {
      return { content: [{ type: "text", text: "Learn MCP Ext-Apps tool initialized. Please interact with the UI to complete modules." }] };
    },
  );

  /**
   * File Explorer Tool.
   *
   * @description
   * This demonstrates a server-side capability that the frontend UI can invoke
   * via the MCP Apps SDK `callServerTool` function. It allows the React frontend
   * to securely request directory listings. This tool is for demo purposes.
   */
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

  /**
   * Register the UI Resource.
   *
   * @description
   * The resource returns the bundled HTML/JavaScript for the React UI.
   * The MCP host uses this payload to render the application in a secure sandboxed iframe.
   * The CSP policies defined here ensure proper domain access control.
   * This is a didactic demo implementation for a single-page React app.
   */
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

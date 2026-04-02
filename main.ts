/**
 * Entry point for running the MCP server.
 * Run with: npx @modelcontextprotocol/server-basic-react
 * Or: node dist/index.js [--stdio]
 */

import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import type { Request, Response } from "express";
import { createServer } from "./server.js";

/**
 * Starts an MCP server with Streamable HTTP transport in stateless mode.
 *
 * @param createServer - Factory function that creates a new McpServer instance per request.
 */
export async function startStreamableHTTPServer(
  createServer: () => McpServer,
): Promise<void> {
  const port = parseInt(process.env.PORT ?? "3001", 10);
  const isUiOnly = process.env.BUILD_FLAVOR === "ui-only";

  const app = createMcpExpressApp({ host: "0.0.0.0" });
  app.use(cors());

  // Always serve the UI on / for convenience, even in full-stack mode.
  app.get("/", (req, res) => {
    // Use absolute path relative to the module to prevent ENOENT when
    // running from another directory.
    const distPath = import.meta.filename.endsWith(".ts")
      ? `${import.meta.dirname}/dist`
      : import.meta.dirname;
    res.sendFile(`${distPath}/mcp-app.html`);
  });

  // Explicitly handle GET for SSE connection and POST for messages, to avoid catching normal browser requests
  app.get("/mcp", async (req: Request, res: Response) => {
    if (isUiOnly) {
      res.status(404).send("MCP Server is disabled in ui-only mode.");
      return;
    }

    // Only reject if it's explicitly html to provide a helpful browser message
    if (req.headers.accept?.includes("text/html")) {
      res.status(400).send("This endpoint is for MCP clients. It requires an SSE connection (text/event-stream) for GET requests or POST for messages.");
      return;
    }

    await handleMcpRequest(req, res);
  });

  app.post("/mcp", async (req: Request, res: Response) => {
    if (isUiOnly) {
      res.status(404).send("MCP Server is disabled in ui-only mode.");
      return;
    }
    await handleMcpRequest(req, res);
  });

  async function handleMcpRequest(req: Request, res: Response) {

    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  }

  const httpServer = app.listen(port, (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
    console.log(`MCP server listening on http://localhost:${port}/mcp`);
  });

  const shutdown = () => {
    console.log("\nShutting down...");
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

/**
 * Starts an MCP server with stdio transport.
 *
 * @param createServer - Factory function that creates a new McpServer instance.
 */
export async function startStdioServer(
  createServer: () => McpServer,
): Promise<void> {
  await createServer().connect(new StdioServerTransport());
}

async function main() {
  if (process.argv.includes("--stdio")) {
    await startStdioServer(createServer);
  } else {
    await startStreamableHTTPServer(createServer);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

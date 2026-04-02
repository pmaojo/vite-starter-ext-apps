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
import fs from "node:fs";
import path from "node:path";
import { createServer } from "./server.js";

/**
 * Starts an MCP server with Streamable HTTP transport in stateless mode.
 *
 * @param createServer - Factory function that creates a new McpServer instance per request.
 */
export function buildApp(createServerFn: () => McpServer) {
  const isUiOnly = process.env.BUILD_FLAVOR === "ui-only";

  const app = createMcpExpressApp({ host: "0.0.0.0" });
  app.use(cors());

  // Always serve the UI on / for convenience, even in full-stack mode.
  app.get("/", (req, res) => {
    // Determine where mcp-app.html is located
    let htmlPath = "";
    if (import.meta.filename.endsWith(".ts")) {
      htmlPath = path.join(import.meta.dirname, "dist", "mcp-app.html");
    } else {
      // In a built application or vercel environment
      htmlPath = path.join(import.meta.dirname, "mcp-app.html");
      if (!fs.existsSync(htmlPath)) {
        // Fallback for Vercel which might run api/index.js instead of dist/index.js
        htmlPath = path.join(process.cwd(), "dist", "mcp-app.html");
      }
    }

    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      res.status(404).send(`UI not found at ${htmlPath}. Ensure the application is built.`);
    }
  });

  // Intercept SSE / Streamable HTTP connections for Vercel
  const handleVercelHeaders = (req: Request, res: Response, next: any) => {
    // Vercel specific settings to allow SSE streaming to pass through properly
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Prevent nginx from buffering
    next();
  };

  // Explicitly handle GET for SSE connection and POST for messages, to avoid catching normal browser requests
  app.get("/mcp", handleVercelHeaders, async (req: Request, res: Response) => {
    if (isUiOnly) {
      res.status(404).send("MCP Server is disabled in ui-only mode.");
      return;
    }

    // Only reject if it's explicitly html to provide a helpful browser message
    if (req.headers.accept?.includes("text/html")) {
      res.status(400).send("This endpoint is for MCP clients. It requires an SSE connection (text/event-stream) for GET requests or POST for messages.");
      return;
    }

    await handleMcpRequest(req, res, createServerFn);
  });

  app.post("/mcp", handleVercelHeaders, async (req: Request, res: Response) => {
    if (isUiOnly) {
      res.status(404).send("MCP Server is disabled in ui-only mode.");
      return;
    }
    await handleMcpRequest(req, res, createServerFn);
  });

  return app;
}

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const serverStore = new Map<string, { server: McpServer, transport: SSEServerTransport }>();

async function handleMcpRequest(req: Request, res: Response, createServerFn: () => McpServer) {
  if (req.method === "GET") {
    const server = createServerFn();
    const transport = new SSEServerTransport("/mcp", res);

    // We store the connection for POST requests to route messages to
    // using the auto-generated sessionId from SSEServerTransport
    const sessionId = transport.sessionId;
    serverStore.set(sessionId, { server, transport });

    res.on("close", () => {
      serverStore.delete(sessionId);
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });

    try {
      await server.connect(transport);
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
  } else if (req.method === "POST") {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      res.status(400).send("Missing sessionId parameter");
      return;
    }

    const connection = serverStore.get(sessionId);
    if (!connection) {
      res.status(404).send("Session not found");
      return;
    }

    try {
      await connection.transport.handlePostMessage(req, res);
    } catch (error) {
      console.error("MCP POST error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  }
}

/**
 * Starts an MCP server with Streamable HTTP transport in stateless mode.
 *
 * @param createServer - Factory function that creates a new McpServer instance per request.
 */
export async function startStreamableHTTPServer(
  createServer: () => McpServer,
): Promise<void> {
  const port = parseInt(process.env.PORT ?? "3001", 10);
  const app = buildApp(createServer);

  const httpServer = app.listen(port, (err?: Error) => {
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

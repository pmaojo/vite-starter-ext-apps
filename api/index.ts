import { mcpHandler } from "../server.js";

export const GET = mcpHandler;
export const POST = mcpHandler;

// Use Node.js runtime instead of Edge to support `node:fs` which is required for reading `mcp-app.html`.
// The `mcp-handler` internally relies on standard Web API polyfills that run just fine on the Node.js Vercel runtime.
export default function handler(req: any, res: any) {
  if (
    typeof req.text !== "function" &&
    res &&
    typeof res.status === "function"
  ) {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || "localhost";
    const url = new URL(req.url, `${protocol}://${host}`);

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? req.body
          ? JSON.stringify(req.body)
          : undefined
        : undefined;

    const webReq = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body,
    });

    // Use mcpHandler natively but don't intercept SSE properly on manual node fallback
    return mcpHandler(webReq).then(async (webRes) => {
      res.status(webRes.status);

      webRes.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (webRes.body) {
        // @ts-ignore
        const reader = webRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } else {
        res.end();
      }
    });
  }

  return mcpHandler(req);
}

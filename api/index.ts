import { mcpHandler } from "../server.js";
import fs from "node:fs";
import path from "node:path";

export const GET = mcpHandler;
export const POST = mcpHandler;

// Use Node.js runtime instead of Edge to support `node:fs` which is required for reading `mcp-app.html`.
// The `mcp-handler` internally relies on standard Web API polyfills that run just fine on the Node.js Vercel runtime.
export default async function handler(req: any, res: any) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'localhost';

    const url = new URL(req.url || '/', `${protocol}://${host}`);

    // Explicitly handle the root route to serve the UI
    if (url.pathname === "/") {
        let htmlPath = path.join(process.cwd(), "mcp-app.html");
        if (!fs.existsSync(htmlPath)) {
            htmlPath = path.join(process.cwd(), "dist", "mcp-app.html");
        }

        if (fs.existsSync(htmlPath)) {
            const html = fs.readFileSync(htmlPath, "utf-8");
            res.status(200);
            res.setHeader("Content-Type", "text/html");
            res.send(html);
        } else {
            res.status(404);
            res.send("UI not found. Ensure the application is built.");
        }
        return;
    }

    if (typeof req.text !== 'function' && res && typeof res.status === 'function') {
        const body = req.method !== 'GET' && req.method !== 'HEAD'
           ? (req.body ? JSON.stringify(req.body) : undefined)
           : undefined;

        const webReq = new Request(url.toString(), {
            method: req.method,
            headers: req.headers,
            body
        });

        // Use mcpHandler natively but don't intercept SSE properly on manual node fallback
        return mcpHandler(webReq).then(async (webRes) => {
            res.status(webRes.status);

            webRes.headers.forEach((value: string, key: string) => {
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

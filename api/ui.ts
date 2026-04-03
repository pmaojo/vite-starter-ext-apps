import fs from "node:fs";
import path from "node:path";

export default function handler(req: any, res: any) {
  let htmlPath = path.join(process.cwd(), "dist", "mcp-app.html");

  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), "mcp-app.html");
  }

  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } else {
    res.status(404).send(`UI not found at ${htmlPath}. Ensure the application is built.`);
  }
}

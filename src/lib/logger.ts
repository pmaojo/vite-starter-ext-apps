import type { App } from "@modelcontextprotocol/ext-apps";
import type { LogMessage } from "../types";

class Logger {
  private app: App | null = null;

  setApp(app: App) {
    this.app = app;
  }

  private async send(level: LogMessage["level"], message: string, data?: any) {
    const logMessage: LogMessage = { level, message, data };

    if (level === "error") {
        console.error(message, data);
    } else if (level === "warn") {
        console.warn(message, data);
    } else if (level === "info") {
        console.info(message, data);
    } else {
        console.debug(message, data);
    }

    if (this.app) {
      try {
          const sendLevel = level === "warn" || level === "error" || level === "info" || level === "debug" ? level : "info";
        await this.app.sendLog({ level: sendLevel as any, data: logMessage });
      } catch (e) {
        console.error("Failed to send log to MCP host", e);
      }
    }
  }

  info(message: string, data?: any) {
    this.send("info", message, data);
  }

  warn(message: string, data?: any) {
    this.send("warn", message, data);
  }

  error(message: string, data?: any) {
    this.send("error", message, data);
  }

  debug(message: string, data?: any) {
    this.send("debug", message, data);
  }
}

export const logger = new Logger();

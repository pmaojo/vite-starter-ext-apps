import type { App } from "@modelcontextprotocol/ext-apps";
import type { LogMessage } from "../types";

let _app: App | null = null;

const sendLog = async (level: LogMessage["level"], message: string, data?: any) => {
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

  if (_app) {
    try {
        const sendLevel = level === "warn" || level === "error" || level === "info" || level === "debug" ? level : "info";
      await _app.sendLog({ level: sendLevel as any, data: logMessage });
    } catch (e) {
      console.error("Failed to send log to MCP host", e);
    }
  }
};

export const logger = {
  setApp: (app: App) => {
    _app = app;
  },

  info: async (message: string, data?: any) => {
    await sendLog("info", message, data);
  },

  warn: async (message: string, data?: any) => {
    await sendLog("warn", message, data);
  },

  error: async (message: string, data?: any) => {
    await sendLog("error", message, data);
  },

  debug: async (message: string, data?: any) => {
    await sendLog("debug", message, data);
  }
};

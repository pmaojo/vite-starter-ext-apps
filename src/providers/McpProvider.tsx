import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { useTranslation } from "react-i18next";
import { logger } from "../lib/logger";

interface McpContextValue {
  app: App | null;
  error: Error | null;
  hostContext: McpUiHostContext | undefined;
  toolResult: CallToolResult | null;
}

const McpContext = createContext<McpContextValue | undefined>(undefined);

export function McpProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [toolResult, setToolResult] = useState<CallToolResult | null>(null);

  const { app, error } = useApp({
    appInfo: { name: "Dynamic MCP App", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      logger.setApp(app);

      app.onteardown = async () => {
        logger.info(t('app.logs.teardown', "App is being torn down"));
        return {};
      };

      app.ontoolinput = async (input) => {
        logger.info(t('app.logs.toolInput', "Received tool call input"), input);
      };

      app.ontoolresult = async (result) => {
        logger.info(t('app.logs.toolResult', "Received tool call result"), result);
        setToolResult(result);
      };

      app.ontoolcancelled = (params) => {
        logger.warn(t('app.logs.toolCancelled', "Tool call cancelled"), { reason: params.reason });
      };

      app.onerror = (e) => logger.error(t('app.logs.error', "App Error"), e);
    },
  });

  const hostContext = useSyncExternalStore(
    (callback) => {
      if (!app) return () => {};
      app.onhostcontextchanged = callback;
      return () => {
        app.onhostcontextchanged = () => {};
      };
    },
    () => app?.getHostContext(),
    () => undefined
  );

  useEffect(() => {
    if (error) {
      logger.error(t('app.logs.error', "App Error"), error.message);
    }
  }, [error, t]);

  const value: McpContextValue = {
    app,
    error,
    hostContext,
    toolResult,
  };

  return <McpContext.Provider value={value}>{children}</McpContext.Provider>;
}

export function useMcp() {
  const context = useContext(McpContext);
  if (context === undefined) {
    throw new Error("useMcp must be used within an McpProvider");
  }
  return context;
}

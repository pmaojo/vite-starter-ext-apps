/**
 * @file App that demonstrates a few features using MCP Apps SDK + React.
 */
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useState, useSyncExternalStore, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { logger } from "./lib/logger";
import { GetTimeTool } from "./tools/GetTimeTool";
import { Toaster } from "./components/ui/sonner";
import "./i18n";
import "./index.css";


const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "get-time": GetTimeTool,
};


function MainApp() {
  const { t } = useTranslation();
  const [toolResult, setToolResult] = useState<CallToolResult | null>(null);

  // `useApp` (1) creates an `App` instance, (2) calls `onAppCreated` to
  // register handlers, and (3) calls `connect()` on the `App` instance.
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
    () => undefined // Server snapshot
  );

  useEffect(() => {
    if (error) {
      logger.error(t('app.logs.error', "App Error"), error.message);
    }
  }, [error, t]);

  if (error) return <div className="p-4 text-destructive flex flex-col items-center justify-center h-screen"><strong>{t('app.error')}</strong> {error.message}</div>;
  if (!app) return <div className="p-4 flex items-center justify-center h-screen text-muted-foreground">{t('app.connecting')}</div>;

  const toolName = hostContext?.toolInfo?.tool?.name;

  if (!toolName) {
    return <div>{t('app.noToolContext')}</div>;
  }

  const ToolComponent = TOOL_COMPONENTS[toolName];

  if (!ToolComponent) {
    return <div>{t('app.toolNotFound', { toolName })}</div>;
  }

  return <ToolComponent app={app} toolResult={toolResult} hostContext={hostContext} />;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApp />
    <Toaster />
  </StrictMode>,
);

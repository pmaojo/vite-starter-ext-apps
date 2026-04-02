/**
 * @file App that demonstrates a few features using MCP Apps SDK + React.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { Toaster } from "./components/ui/sonner";
import { McpProvider, useMcp } from "./providers/McpProvider";
import { TOOL_COMPONENTS } from "./tools/registry";
import "./i18n";
import "./index.css";

function AppContent() {
  const { t } = useTranslation();
  const { app, error, hostContext, toolResult } = useMcp();

  if (error) {
    return (
      <div className="p-4 text-destructive flex flex-col items-center justify-center h-screen">
        <strong>{t('app.error')}</strong> {error.message}
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-4 flex items-center justify-center h-screen text-muted-foreground">
        {t('app.connecting')}
      </div>
    );
  }

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
    <McpProvider>
      <AppContent />
      <Toaster />
    </McpProvider>
  </StrictMode>,
);

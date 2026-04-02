import { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "../lib/logger";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

// ---------------------------------------------------------------------------
// Session-persistent cache for module re-evaluations (HMR) and forward/back
// browser history. The host bridge only gives us toolResult once when called.
// ---------------------------------------------------------------------------

const STORAGE = {
  RESULT: "__mcp_tool_result",
} as const;

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    if (value == null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sessionStorage may be unavailable in some sandboxes */
  }
}

// Memory cache so we can useSyncExternalStore and have concurrent-safe reads
let memToolResult = read<CallToolResult>(STORAGE.RESULT);

const listeners = new Set<() => void>();
function notify() {
  for (const l of listeners) l();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

interface McpContextValue {
  app: App | null;
  error: Error | null;
  hostContext: McpUiHostContext | undefined;
  toolResult: CallToolResult | null;
}

const McpContext = createContext<McpContextValue | undefined>(undefined);

export function McpProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  // State managed mostly by useApp, except for hostContext which isn't part of the core return value
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>(undefined);

  // We sync toolResult with external store because of session storage and HMR
  const toolResult = useSyncExternalStore(subscribe, () => memToolResult, () => null);

  const onAppCreated = useCallback((newApp: App) => {
    newApp.onteardown = async () => {
      return {};
    };

    newApp.ontoolinput = async (input) => {
      logger.info("Received tool call input", input);
    };

    newApp.ontoolresult = async (result) => {
      logger.info("Received tool call result", result);
      memToolResult = result as CallToolResult;
      write(STORAGE.RESULT, memToolResult);
      notify();
    };

    newApp.ontoolcancelled = (params) => {
      logger.warn("Tool call cancelled", { reason: params.reason });
    };

    newApp.onerror = (e) => {
      console.error("[mcp-app] error:", e);
    };

    newApp.onhostcontextchanged = () => {
      setHostContext(newApp.getHostContext());
    };

    // Set logger app instance right away
    logger.setApp(newApp);
  }, []);

  const { app, error } = useApp({
    appInfo: { name: "Dynamic MCP App", version: "1.0.0" },
    capabilities: {},
    onAppCreated,
  });

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

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "../lib/logger";
import { App } from "@modelcontextprotocol/ext-apps";
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

// ---------------------------------------------------------------------------
// Session-persistent singleton App instance.
//
// The MCP host establishes a single bridge per iframe. We create the App once
// and share it across all pages. Tool data is persisted to sessionStorage so
// it survives client-side navigations, module re-evaluations (HMR), and
// forward/back browser history.
// ---------------------------------------------------------------------------

const STORAGE = {
  RESULT: "__mcp_tool_result",
  CONNECTED: "__mcp_connected",
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

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

let memConnected = read<boolean>(STORAGE.CONNECTED) ?? false;
let memToolResult = read<CallToolResult>(STORAGE.RESULT);
let memError: Error | null = null;
let memHostContext: McpUiHostContext | undefined = undefined;

const listeners = new Set<() => void>();
function notify() {
  for (const l of listeners) l();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---------------------------------------------------------------------------
// Singleton connection
// ---------------------------------------------------------------------------

let singletonApp: App | null = null;
let appCreationPromise: Promise<void> | null = null;

async function ensureConnected() {
  if (singletonApp) return;
  if (appCreationPromise) return appCreationPromise;

  appCreationPromise = (async () => {
    try {
      const app = new App(
        { name: "Dynamic MCP App", version: "1.0.0" },
        {},
        { autoResize: true },
      );

      app.onteardown = async () => {
        // Translation is handled in components; logger will be attached to app soon
        return {};
      };

      app.ontoolinput = async (input) => {
        logger.info("Received tool call input", input);
      };

      app.ontoolresult = async (result) => {
        logger.info("Received tool call result", result);
        memToolResult = result as CallToolResult;
        write(STORAGE.RESULT, memToolResult);
        notify();
      };

      app.ontoolcancelled = (params) => {
        logger.warn("Tool call cancelled", { reason: params.reason });
      };

      app.onerror = (e) => {
        console.error("[mcp-app] error:", e);
        memError = e instanceof Error ? e : new Error(String(e));
        notify();
      };

      app.onhostcontextchanged = () => {
        memHostContext = app.getHostContext();
        notify();
      };

      await app.connect();
      singletonApp = app;
      logger.setApp(app);
      memConnected = true;
      memHostContext = app.getHostContext();
      write(STORAGE.CONNECTED, true);
      console.log("[mcp-app] connected to host");
      notify();
    } catch (err) {
      console.warn("[mcp-app] connect failed (not in MCP host?):", err);
      memError = err instanceof Error ? err : new Error(String(err));
      notify();
    }
  })();

  return appCreationPromise;
}

// Kick off connection once
if (typeof window !== "undefined" && window.self !== window.top) {
  ensureConnected();
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

  useSyncExternalStore(subscribe, () => memConnected, () => false); // just to trigger re-renders if connection state changes
  const toolResult = useSyncExternalStore(subscribe, () => memToolResult, () => null);
  const error = useSyncExternalStore(subscribe, () => memError, () => null);
  const hostContext = useSyncExternalStore(subscribe, () => memHostContext, () => undefined);

  // Still attempt connection if not in iframe but rendering (e.g. debugging)
  useEffect(() => {
    ensureConnected();
  }, []);

  useEffect(() => {
    if (error) {
      logger.error(t('app.logs.error', "App Error"), error.message);
    }
  }, [error, t]);

  const value: McpContextValue = {
    app: singletonApp,
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

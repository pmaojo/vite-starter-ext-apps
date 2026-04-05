import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { logger } from "./logger";
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

/**
 * MCP Context Provider.
 *
 * @description
 * This component establishes the foundation for the frontend MCP layer. It encapsulates the complex
 * lifecycle of an MCP application connection and exposes a simplified, reactive context for React components.
 *
 * Architectural Highlights:
 * 1. **`useApp` Integration:** Strictly adheres to SDK standards by utilizing `@modelcontextprotocol/ext-apps/react`'s
 *    `useApp` hook rather than manually managing the WebSocket/bridge connection.
 * 2. **State Synchronization:** Due to potential module re-evaluations (HMR) and the fact that the host bridge
 *    dispatches tool results only once, it utilizes a memory-backed session cache and `useSyncExternalStore`
 *    to ensure reliable, concurrent-safe reads of the `toolResult`.
 * 3. **Global Event Bridging:** Catches low-level SDK events (`onhostcontextchanged`, `ontoolresult`) and
 *    maps them into standard React state.
 *
 * Note: This implementation acts as a robust didactic starter illustrating best practices for managing
 * async state and host environment boundaries within MCP Apps.
 *
 * @see {@link https://github.com/modelcontextprotocol/ext-apps} for core concepts.
 */
export function McpProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  // State managed mostly by useApp, except for hostContext which isn't part of the core return value
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>(
    undefined
  );

  // We sync toolResult with external store because of session storage and HMR
  const toolResult = useSyncExternalStore(
    subscribe,
    () => memToolResult,
    () => null
  );

  /**
   * App lifecycle and event callbacks setup.
   * @param {App} newApp The initialized app instance provided by the SDK.
   */
  const onAppCreated = useCallback((newApp: App) => {
    // Graceful termination handler
    newApp.onteardown = async () => {
      return {};
    };

    // Fired when the user interacts with the app inputs
    newApp.ontoolinput = async (input) => {
      logger.info("Received tool call input", input);
    };

    // Stores the latest tool execution result dispatched by the host
    newApp.ontoolresult = async (result) => {
      logger.info("Received tool call result", result);
      memToolResult = result as CallToolResult;
      write(STORAGE.RESULT, memToolResult);
      notify();
    };

    // Handled when a tool invocation is cancelled by the user or host
    newApp.ontoolcancelled = (params) => {
      logger.warn("Tool call cancelled", { reason: params.reason });
    };

    // Global connection error handler
    newApp.onerror = (e) => {
      console.error("[mcp-app] error:", e);
    };

    // Keeps our React state in sync with changes to the host environment
    newApp.onhostcontextchanged = () => {
      setHostContext(newApp.getHostContext());
    };

    // Set logger app instance right away
    logger.setApp(newApp);
  }, []);

  /**
   * The core SDK hook initializing the frontend application.
   */
  const { app, error } = useApp({
    appInfo: { name: "Dynamic MCP App", version: "1.0.0" },
    capabilities: {},
    onAppCreated,
  });

  useEffect(() => {
    if (error) {
      logger.error(t("app.logs.error", "App Error"), error.message);
    }
  }, [error, t]);

  // Sync the host theme with the document root class for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (hostContext?.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [hostContext?.theme]);

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

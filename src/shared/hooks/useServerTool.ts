import { useState, useCallback, useEffect } from "react";
import type { App } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

interface UseServerToolResult {
  activeResult: CallToolResult | null;
  isError: boolean;
  isLoading: boolean;
  executeTool: (args?: Record<string, unknown>) => Promise<void>;
}

export function useServerTool(
  app: App | null,
  toolName: string,
  hostProvidedResult: CallToolResult | null
): UseServerToolResult {
  const [lastHostResult, setLastHostResult] = useState<CallToolResult | null>(
    hostProvidedResult
  );
  const [manualResult, setManualResult] = useState<CallToolResult | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If the host passed down a new toolResult, override our manual result tracking
  useEffect(() => {
    if (hostProvidedResult !== lastHostResult) {
      setLastHostResult(hostProvidedResult);
      setManualResult(null); // Clear manual result so host result takes precedence
      setIsError(false);
    }
    // lastHostResult intentionally omitted — we only want to react to host-driven changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostProvidedResult]);

  const executeTool = useCallback(
    async (args: Record<string, unknown> = {}) => {
      if (!app) return;
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await app.callServerTool({
          name: toolName,
          arguments: args,
        });
        setManualResult(result as CallToolResult);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [app, toolName]
  );

  const activeResult = manualResult || hostProvidedResult;

  return {
    activeResult,
    isError,
    isLoading,
    executeTool,
  };
}

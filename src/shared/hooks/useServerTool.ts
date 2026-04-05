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
  const [manualResult, setManualResult] = useState<CallToolResult | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // When the host provides a new result, clear any manual result so the host takes precedence
  useEffect(() => {
    setManualResult(null);
    setIsError(false);
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

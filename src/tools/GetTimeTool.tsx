import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function extractTime(callToolResult: CallToolResult | null | undefined): string | null {
  if (!callToolResult) return null;
  const content = callToolResult.content?.find((c) => c.type === "text") as { text: string } | undefined;
  return content?.text ?? null;
}

interface GetTimeToolProps {
  app: App;
  toolResult: CallToolResult | null;
  hostContext?: McpUiHostContext;
}

export function GetTimeTool({ app, toolResult }: GetTimeToolProps) {
  const { t } = useTranslation();

  // We can track the latest *manual* refresh result
  const [manualResult, setManualResult] = useState<CallToolResult | null>(null);
  const [isError, setIsError] = useState(false);

  // Directly derive the time from either a manual refresh or the initial tool result
  const activeResult = manualResult || toolResult;
  const timeText = extractTime(activeResult);

  const serverTimeDisplay = isError
    ? t("getTime.error")
    : (timeText || t("getTime.loading"));

  const handleGetTime = useCallback(async () => {
    try {
      setIsError(false);
      const result = await app.callServerTool({ name: "get-time", arguments: {} });
      setManualResult(result as CallToolResult);
    } catch (e) {
      setIsError(true);
    }
  }, [app]);

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>{t("getTime.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{t("getTime.serverTime")}</p>
        <p className="text-2xl font-mono">{serverTimeDisplay}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetTime} className="w-full">{t("getTime.refresh")}</Button>
      </CardFooter>
    </Card>
  );
}

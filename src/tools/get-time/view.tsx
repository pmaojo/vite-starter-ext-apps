import { useTranslation } from "react-i18next";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useServerTool } from "@/shared/hooks/useServerTool";
import type { ToolComponentProps } from "@/core/framework/tool-contract";

function extractTime(callToolResult: CallToolResult | null | undefined): string | null {
  if (!callToolResult) return null;
  const content = callToolResult.content?.find((c) => c.type === "text") as { text: string } | undefined;
  return content?.text ?? null;
}

/**
 * Get Time Tool View.
 *
 * @description
 * This component demonstrates handling server tool executions and extracting
 * the result dispatched from the backend. It uses a custom hook `useServerTool`
 * to fetch and maintain state. This is a didactic starter component for demo purposes.
 *
 * @param {ToolComponentProps} props - The standard props injected by the App router.
 */
export function GetTimeTool({ app, toolResult }: ToolComponentProps) {
  const { t } = useTranslation();

  const { activeResult, isError, isLoading, executeTool } = useServerTool(
    app,
    "get-time",
    toolResult
  );

  const timeText = extractTime(activeResult);

  const serverTimeDisplay = isError
    ? t("getTime.error")
    : (timeText || t("getTime.loading"));

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
        <Button
          onClick={() => executeTool({})}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? t("getTime.loading") : t("getTime.refresh")}
        </Button>
      </CardFooter>
    </Card>
  );
}

import { FullscreenView } from "@/shared/components/ui/fullscreen-view";
import type { ToolComponentProps } from "@/core/framework/tool-contract";

export function DocsView({ toolResult }: ToolComponentProps) {
  // Extract baseURL from the toolResult, falling back to localhost if unavailable.
  // We use this external absolute URL because the sandboxed host iframe (where this UI runs)
  // often resolves window.location.origin to 'null', which breaks relative paths.
  let baseURL = "http://localhost:3001";
  try {
    const rawText = toolResult?.content?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (parsed.baseURL) {
        baseURL = parsed.baseURL;
      }
    }
  } catch (error) {
    console.warn("Failed to parse baseURL from toolResult, using fallback", error);
  }

  // Using an iframe to render the generated TypeDoc HTML within the MCP app
  return (
    <FullscreenView title="API Documentation" onClose={() => {}}>
      <div className="flex flex-col flex-1 h-[80vh] w-[90vw]">
        <iframe
          src={`${baseURL}/docs/index.html`}
          className="w-full h-full border-none rounded-md bg-white"
          title="Typedoc API Documentation"
        />
      </div>
    </FullscreenView>
  );
}
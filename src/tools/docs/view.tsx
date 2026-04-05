import * as React from "react";
import { FullscreenView } from "@/shared/components/ui/fullscreen-view";
import type { ToolComponentProps } from "@/core/framework/tool-contract";

export function DocsView({ args }: ToolComponentProps) {
  // Using an iframe to render the generated TypeDoc HTML within the MCP app
  return (
    <FullscreenView title="API Documentation" onBack={() => {}}>
      <div className="flex flex-col flex-1 h-[80vh] w-[90vw]">
        <iframe
          src="/docs/index.html"
          className="w-full h-full border-none rounded-md bg-white"
          title="Typedoc API Documentation"
        />
      </div>
    </FullscreenView>
  );
}
import { FullscreenView } from "@/shared/components/ui/fullscreen-view";

export function DocsView() {
  // Using an iframe to render the generated TypeDoc HTML within the MCP app
  return (
    <FullscreenView title="API Documentation">
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
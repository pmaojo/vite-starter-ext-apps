import React, { useRef } from "react";
import { Button } from "../../shared/components/ui/button";
import { toast } from "sonner";
import "./app.scss";

// Load the heavy 3D Tetris bundle dynamically
const Tetris = React.lazy(() => import("./pages/Tetris"));

import type { ToolComponentProps } from "../../core/framework/tool-contract";

export const ThreeJSTetrisTool: React.FC<ToolComponentProps> = ({
  app,
  hostContext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isFullscreen = hostContext?.displayMode === "fullscreen";

  const toggleFullscreen = async () => {
    if (!app) {
      toast.error("App not connected.");
      return;
    }
    try {
      const newMode = isFullscreen ? "inline" : "fullscreen";
      await app.requestDisplayMode({ mode: newMode });
    } catch (e: any) {
      toast.error(`Failed to request display mode change: ${e.message}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black flex items-center justify-center ${isFullscreen ? "h-screen" : "h-[600px] rounded-md border shadow-sm"}`}
    >
      <React.Suspense fallback={<div className="text-white p-4">Loading 3D Engine...</div>}>
        <Tetris />
      </React.Suspense>

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white border-0 z-10"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? "Exit" : "Fullscreen"}
      </Button>
    </div>
  );
};

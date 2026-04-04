import { Maximize, Minimize } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../shared/components/ui/button";
import Tetris from "./pages/Tetris";
import "./app.scss";

import type { ToolComponentProps } from "../../core/framework/tool-contract";

export const ThreeJSTetrisTool: React.FC<ToolComponentProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black flex items-center justify-center ${isFullscreen ? 'h-screen' : 'h-[600px] rounded-md border shadow-sm'}`}
    >
      <Tetris />

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white border-0 z-10"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
    </div>
  );
};

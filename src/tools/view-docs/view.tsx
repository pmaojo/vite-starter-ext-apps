import React from "react";
import { ToolComponentProps } from "@/core/framework/tool-contract";

export const ViewDocsTool: React.FC<ToolComponentProps> = ({ isDevelopment }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <iframe
        src={isDevelopment ? "http://localhost:3001/docs/index.html" : "/docs/index.html"}
        className="w-full h-full border-none rounded-lg shadow-md"
        title="Documentation"
      />
    </div>
  );
};

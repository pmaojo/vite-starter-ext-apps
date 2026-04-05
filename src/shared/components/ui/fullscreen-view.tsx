import * as React from "react";
import { cn } from "@/lib/utils";
import XIcon from "lucide-react/dist/esm/icons/x";
import { Button } from "@/shared/components/ui/button";

export interface FullscreenViewProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  title?: string;
}

export function FullscreenView({
  className,
  onClose,
  title,
  children,
  ...props
}: FullscreenViewProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background text-foreground animate-in slide-in-from-bottom-4 duration-300",
        className
      )}
      {...props}
    >
      <header className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex-1">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={onClose}
            aria-label="Close fullscreen"
          >
            <XIcon className="w-5 h-5" />
          </Button>
        )}
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl h-full">{children}</div>
      </main>

      {/*
        Note: The actual ChatGPT composer sits over this view.
        We provide a spacer here so content isn't hidden behind it.
      */}
      <div className="h-24 shrink-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InlineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  expandable?: boolean
  onExpand?: () => void
  showMore?: boolean
  onShowMore?: () => void
  primaryActions?: React.ReactNode
}

export function InlineCard({
  className,
  title,
  expandable,
  onExpand,
  showMore,
  onShowMore,
  primaryActions,
  children,
  ...props
}: InlineCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm max-w-sm w-full overflow-hidden",
        className
      )}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-semibold leading-none tracking-tight">{title}</h3>
          {expandable && (
            <button
              onClick={onExpand}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Expand card"
            >
              Expand
            </button>
          )}
        </div>
      )}
      <div className="p-4 flex-grow flex flex-col justify-center">
        {children}
      </div>
      {(showMore || primaryActions) && (
        <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between gap-2">
          {showMore && (
            <button
              onClick={onShowMore}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Show more
            </button>
          )}
          {primaryActions && (
            <div className="flex items-center gap-2 ml-auto">
              {primaryActions}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

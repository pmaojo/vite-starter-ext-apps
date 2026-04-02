"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[]
  offset?: number
}

export const CardStack = React.forwardRef<HTMLDivElement, CardStackProps>(
  ({ className, items, offset = 10, ...props }, ref) => {
    // Only display up to 3 cards in the visual stack for performance/cleanliness
    const displayItems = items.slice(0, 3)

    return (
      <div ref={ref} className={cn("relative w-full h-full", className)} {...props}>
        {displayItems.map((item, index) => {
          // Reverse index so the first item is on top
          const reverseIndex = displayItems.length - 1 - index
          const isTop = index === 0

          return (
            <div
              key={index}
              className={cn(
                "absolute top-0 w-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
                !isTop && "opacity-80 scale-[0.95]"
              )}
              style={{
                zIndex: displayItems.length - index,
                transform: `translateY(${index * offset}px) scale(${1 - index * 0.05})`,
              }}
            >
              {item}
            </div>
          )
        })}
      </div>
    )
  }
)
CardStack.displayName = "CardStack"
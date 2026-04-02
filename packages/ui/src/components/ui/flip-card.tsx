"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  frontContent: React.ReactNode
  backContent: React.ReactNode
  isFlipped?: boolean
  onFlippedChange?: (isFlipped: boolean) => void
  flipOnHover?: boolean
}

export const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  (
    {
      className,
      frontContent,
      backContent,
      isFlipped = false,
      onFlippedChange,
      flipOnHover = false,
      ...props
    },
    ref
  ) => {
    const [internalFlipped, setInternalFlipped] = React.useState(isFlipped)
    const isControlled = onFlippedChange !== undefined
    const currentFlipped = isControlled ? isFlipped : internalFlipped

    const handleClick = () => {
      if (!flipOnHover) {
        if (!isControlled) {
          setInternalFlipped(!internalFlipped)
        }
        if (onFlippedChange) {
          onFlippedChange(!currentFlipped)
        }
      }
    }

    return (
      <div
        ref={ref}
        className={cn("group [perspective:1000px] relative h-64 w-full cursor-pointer", className)}
        onClick={handleClick}
        {...props}
      >
        <div
          className={cn(
            "[transform-style:preserve-3d] relative h-full w-full duration-500 transition-transform",
            currentFlipped ? "[transform:rotateY(180deg)]" : "",
            flipOnHover ? "group-hover:[transform:rotateY(180deg)]" : ""
          )}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm [backface-visibility:hidden]"
          >
            {frontContent}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            {backContent}
          </div>
        </div>
      </div>
    )
  }
)
FlipCard.displayName = "FlipCard"
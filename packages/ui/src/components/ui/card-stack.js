"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
export const CardStack = React.forwardRef(({ className, items, offset = 10, ...props }, ref) => {
    // Only display up to 3 cards in the visual stack for performance/cleanliness
    const displayItems = items.slice(0, 3);
    return (_jsx("div", { ref: ref, className: cn("relative w-full h-full", className), ...props, children: displayItems.map((item, index) => {
            // Reverse index so the first item is on top
            const reverseIndex = displayItems.length - 1 - index;
            const isTop = index === 0;
            return (_jsx("div", { className: cn("absolute top-0 w-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300", !isTop && "opacity-80 scale-[0.95]"), style: {
                    zIndex: displayItems.length - index,
                    transform: `translateY(${index * offset}px) scale(${1 - index * 0.05})`,
                }, children: item }, index));
        }) }));
});
CardStack.displayName = "CardStack";

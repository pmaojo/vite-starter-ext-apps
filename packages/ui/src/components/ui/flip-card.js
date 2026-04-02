"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
export const FlipCard = React.forwardRef(({ className, frontContent, backContent, isFlipped = false, onFlippedChange, flipOnHover = false, ...props }, ref) => {
    const [internalFlipped, setInternalFlipped] = React.useState(isFlipped);
    const isControlled = onFlippedChange !== undefined;
    const currentFlipped = isControlled ? isFlipped : internalFlipped;
    const handleClick = () => {
        if (!flipOnHover) {
            if (!isControlled) {
                setInternalFlipped(!internalFlipped);
            }
            if (onFlippedChange) {
                onFlippedChange(!currentFlipped);
            }
        }
    };
    return (_jsx("div", { ref: ref, className: cn("group [perspective:1000px] relative h-64 w-full cursor-pointer", className), onClick: handleClick, ...props, children: _jsxs("div", { className: cn("[transform-style:preserve-3d] relative h-full w-full duration-500 transition-transform", currentFlipped ? "[transform:rotateY(180deg)]" : "", flipOnHover ? "group-hover:[transform:rotateY(180deg)]" : ""), children: [_jsx("div", { className: "absolute inset-0 flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm [backface-visibility:hidden]", children: frontContent }), _jsx("div", { className: "absolute inset-0 flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]", children: backContent })] }) }));
});
FlipCard.displayName = "FlipCard";

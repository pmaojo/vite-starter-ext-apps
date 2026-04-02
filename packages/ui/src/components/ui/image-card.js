import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
export const ImageCard = React.forwardRef(({ className, imageUrl, imageAlt = "Image", title, description, footer, children, ...props }, ref) => {
    return (_jsxs(Card, { ref: ref, className: cn("overflow-hidden flex flex-col", className), ...props, children: [_jsx("div", { className: "relative aspect-video w-full overflow-hidden bg-muted", children: _jsx("img", { src: imageUrl, alt: imageAlt, className: "object-cover w-full h-full transition-transform duration-300 hover:scale-105" }) }), (title || description) && (_jsxs(CardHeader, { children: [title && _jsx(CardTitle, { children: title }), description && _jsx(CardDescription, { children: description })] })), children && _jsx(CardContent, { className: "flex-grow", children: children }), footer && _jsx(CardFooter, { children: footer })] }));
});
ImageCard.displayName = "ImageCard";

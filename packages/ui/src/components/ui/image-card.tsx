import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { cn } from "@/lib/utils"

export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string
  imageAlt?: string
  title?: string
  description?: string
  footer?: React.ReactNode
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({ className, imageUrl, imageAlt = "Image", title, description, footer, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("overflow-hidden flex flex-col", className)} {...props}>
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        {children && <CardContent className="flex-grow">{children}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    )
  }
)
ImageCard.displayName = "ImageCard"
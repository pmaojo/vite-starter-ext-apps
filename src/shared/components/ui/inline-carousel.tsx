import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

export interface InlineCarouselItem {
  id: string | number
  image?: string
  title?: string
  metadata?: string[]
  badge?: string
  actionLabel?: string
  onAction?: () => void
}

export interface InlineCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: InlineCarouselItem[]
}

export function InlineCarousel({
  className,
  items,
  ...props
}: InlineCarouselProps) {
  if (!items || items.length === 0) return null

  return (
    <div className={cn("w-full max-w-2xl px-8", className)} {...props}>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <div className="flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                  {item.image && (
                    <div className="aspect-video w-full bg-muted relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title || "Carousel image"}
                        className="object-cover w-full h-full"
                      />
                      {item.badge && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="shadow-sm">
                            {item.badge}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    {!item.image && item.badge && (
                      <div className="mb-2">
                        <Badge variant="secondary">{item.badge}</Badge>
                      </div>
                    )}
                    {item.title && (
                      <h4 className="text-sm font-semibold mb-1 line-clamp-1">{item.title}</h4>
                    )}
                    {item.metadata && item.metadata.length > 0 && (
                      <div className="text-xs text-muted-foreground flex-grow mb-3 space-y-0.5">
                        {item.metadata.slice(0, 3).map((meta, idx) => (
                          <p key={idx} className="line-clamp-1">{meta}</p>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto">
                       {item.actionLabel && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={item.onAction}
                        >
                          {item.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

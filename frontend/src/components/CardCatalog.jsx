"use client"

import { useState } from "react"
import { Star, Check, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CardCatalog({ course, index, columns = 4 }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price) => `₫${price.toLocaleString()}`

  // Kiểm tra xem card này có phải ở cột cuối không
  const isRightEdge = (index + 1) % columns === 0

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <Card className="overflow-hidden border-border bg-card transition-all hover:border-primary/50 py-0">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="px-4 pb-4">
          <h3 className="mb-1 line-clamp-2 text-base font-semibold leading-tight text-card-foreground">
            {course.title}
          </h3>
          <p className="mb-1 text-xs text-gray-600 truncate">
            {course.instructor}
          </p>
          <div className="mb-1 flex items-center gap-1">
            <span className="text-xs font-bold text-yellow-500">
              {course.rating}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(course.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({course.reviews})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-card-foreground">
              {formatPrice(course.price)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(course.originalPrice)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Hover Popover */}
      {isHovered && (
        <div
          className={`absolute -top-20 z-50 w-80 animate-in fade-in ${
            isRightEdge
              ? "right-full mr-2 slide-in-from-right-2"
              : "left-full ml-2 slide-in-from-left-2"
          }`}
        >
          <Card className="border-border bg-popover shadow-2xl">
            <CardContent className="p-6">
              <h3 className="mb-3 text-xl font-bold leading-tight text-popover-foreground text-balance">
                {course.title}
              </h3>
              <div className="mb-4 flex items-center gap-2 text-sm text-popover-foreground/80">
                <span className="font-medium text-green-600">
                  Updated {course.updated}
                </span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm text-popover-foreground/70">
                <span>{course.duration}</span>
                <span>•</span>
                <span>{course.level}</span>
                {course.hasSubtitles && (
                  <>
                    <span>•</span>
                    <span>Subtitles</span>
                  </>
                )}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-popover-foreground/90">
                {course.description}
              </p>
              <ul className="mb-6 space-y-2">
                {course.learningPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-popover-foreground/70" />
                    <span className="leading-relaxed text-popover-foreground/80">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Add to cart
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0 border-popover-foreground/20 hover:bg-popover-foreground/10 bg-transparent"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
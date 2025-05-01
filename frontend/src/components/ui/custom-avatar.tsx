import React from "react"
import { cn } from "@/lib/utils"

interface CustomAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
  status?: "online" | "offline" | "away" | "busy" | null
}

export function CustomAvatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  status = null,
  className,
  ...props
}: CustomAvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-zinc-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-md border border-zinc-700 bg-zinc-800",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-sm font-medium text-zinc-300">
            {fallback ? getInitials(fallback) : "??"}
          </div>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black",
            statusClasses[status]
          )}
        />
      )}
    </div>
  )
}


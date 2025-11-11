import { ImageOff, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductImagePlaceholderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ProductImagePlaceholder({
  className,
  size = "md"
}: ProductImagePlaceholderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  }

  return (
    <div className={cn(
      "flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100",
      className
    )}>
      <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
        <Package className={cn(sizeClasses[size], "stroke-[1.5]")} />
        <span className="text-xs text-gray-400 font-medium">No Image</span>
      </div>
    </div>
  )
}

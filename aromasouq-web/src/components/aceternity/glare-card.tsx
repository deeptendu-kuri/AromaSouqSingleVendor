"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface GlareCardProps {
  children: React.ReactNode
  className?: string
}

export function GlareCard({ children, className }: GlareCardProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{
        background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(201, 168, 106, 0.15), transparent 80%)`,
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

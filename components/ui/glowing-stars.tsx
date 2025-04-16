"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  blinkDuration: number
}

interface GlowingStarsProps {
  number?: number
  className?: string
  starColor?: string
  glowColor?: string
}

export function GlowingStars({
  number = 50,
  className,
  starColor = "rgba(255, 255, 255, 0.8)",
  glowColor = "rgba(255, 255, 255, 0.5)",
}: GlowingStarsProps) {
  const [stars, setStars] = useState<Star[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      const newStars: Star[] = []
      for (let i = 0; i < number; i++) {
        newStars.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          blinkDuration: Math.random() * 3 + 2,
        })
      }
      setStars(newStars)
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })

        // Recalculate star positions when container size changes
        setStars((prevStars) =>
          prevStars.map((star) => ({
            ...star,
            x: Math.random() * width,
            y: Math.random() * height,
          })),
        )
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [number])

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            boxShadow: `0 0 ${star.size * 2}px ${star.size}px ${glowColor}`,
            opacity: star.opacity,
            animation: `blink ${star.blinkDuration}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}


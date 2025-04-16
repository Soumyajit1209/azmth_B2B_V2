"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface WavyBackgroundProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
  direction?: "up" | "down"
  waveStrength?: number
}

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  direction = "up",
  waveStrength = 20,
}: WavyBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)
  const [paths, setPaths] = useState<JSX.Element[]>([])
  const [animationId, setAnimationId] = useState<number | null>(null)
  const [phase, setPhase] = useState(0)

  const speedFactor = speed === "fast" ? 1 : 0.5

  useEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect()
      setSvgHeight(height)
    }
  }, [])

  useEffect(() => {
    if (svgHeight > 0) {
      generatePaths()
    }
  }, [svgHeight, colors, waveWidth, waveStrength, direction])

  useEffect(() => {
    if (paths.length > 0) {
      startAnimation()
    }

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [paths])

  const generatePaths = () => {
    const newPaths: JSX.Element[] = []
    const yOffset = direction === "down" ? -0.5 : 0.5

    colors.forEach((color, i) => {
      const points: { x: number; y: number }[] = []
      const segmentCount = Math.ceil(window.innerWidth / waveWidth) + 1

      for (let j = 0; j <= segmentCount; j++) {
        const x = j * waveWidth
        const y = svgHeight / 2 + Math.sin(j) * waveStrength
        points.push({ x, y })
      }

      const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`

      newPaths.push(
        <path
          key={i}
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity={waveOpacity}
          className={`wave wave-${i}`}
        />,
      )
    })

    setPaths(newPaths)
  }

  const startAnimation = () => {
    const animate = () => {
      setPhase((prev) => prev + 0.01 * speedFactor)
      const id = requestAnimationFrame(animate)
      setAnimationId(id)
    }

    animate()
  }

  return (
    <div ref={containerRef} className={cn("h-full w-full overflow-hidden", containerClassName)}>
      <div className={cn("h-full w-full", className)}>{children}</div>
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height={svgHeight}
          className={cn("absolute inset-0")}
          style={{
            filter: `blur(${blur}px)`,
            transform: direction === "down" ? "rotate(180deg)" : "none",
          }}
        >
          <rect width="100%" height={svgHeight} fill={backgroundFill} />
          <g
            style={{
              transform: `translateX(${phase * 100}px)`,
            }}
          >
            {paths}
          </g>
        </svg>
      </div>
    </div>
  )
}

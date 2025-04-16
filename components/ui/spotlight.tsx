"use client"

import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"

interface SpotlightProps {
  className?: string
  fill?: string
  size?: number
}

export function Spotlight({ className, fill = "white", size = 500 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0 })
  const containerSize = useRef({ width: 0, height: 0 })
  const [visible, setVisible] = useState(false)
  const requestRef = useRef<number | null>(null)
  const isMounted = useRef(true)

  const onMouseMove = (event: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mousePosition.current = { x, y }
  }

  const render = () => {
    if (!visible || !isMounted.current) return

    // Add some easing to the mouse movement
    mouse.current.x += (mousePosition.current.x - mouse.current.x) * 0.1
    mouse.current.y += (mousePosition.current.y - mouse.current.y) * 0.1

    if (containerRef.current) {
      const spotlight = containerRef.current.querySelector("circle")
      if (spotlight) {
        spotlight.setAttribute("cx", `${mouse.current.x}`)
        spotlight.setAttribute("cy", `${mouse.current.y}`)
      }
    }

    requestRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    isMounted.current = true

    if (!containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    containerSize.current = { width, height }
    mousePosition.current = { x: width / 2, y: height / 2 }
    mouse.current = { x: width / 2, y: height / 2 }

    window.addEventListener("mousemove", onMouseMove)
    setVisible(true)
    requestRef.current = requestAnimationFrame(render)

    return () => {
      isMounted.current = false
      window.removeEventListener("mousemove", onMouseMove)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden [mask-image:radial-gradient(100%_100%_at_top_center,black,transparent)]",
        className,
      )}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease",
      }}
    >
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient
            id="radial-gradient"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform={`translate(${mouse.current.x} ${mouse.current.y}) scale(${size})`}
          >
            <stop offset="0%" stopColor={fill} stopOpacity="0.1" />
            <stop offset="10%" stopColor={fill} stopOpacity="0.08" />
            <stop offset="20%" stopColor={fill} stopOpacity="0.06" />
            <stop offset="30%" stopColor={fill} stopOpacity="0.04" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={mouse.current.x} cy={mouse.current.y} r={size} fill="url(#radial-gradient)" />
      </svg>
    </div>
  )
}


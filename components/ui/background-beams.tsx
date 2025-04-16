"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface BackgroundBeamsProps extends React.HTMLAttributes<HTMLDivElement> {
  disableAnimation?: boolean
}

export function BackgroundBeams({ className, disableAnimation = false, ...props }: BackgroundBeamsProps) {
  const [opacity, setOpacity] = useState(0)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disableAnimation) {
      setOpacity(1)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpacity(1)
        } else {
          setOpacity(0)
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [disableAnimation])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full overflow-hidden", className)}
      style={{
        opacity: opacity,
        transition: "opacity 1s ease",
      }}
      {...props}
    >
      <svg
        width={size.width || "100%"}
        height={size.height || "100%"}
        viewBox={`0 0 ${size.width || 100} ${size.height || 100}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-0"
        preserveAspectRatio="none"
      >
        <g clipPath="url(#clip0_1_2)">
          <g filter="url(#filter0_f_1_2)">
            <ellipse
              cx={size.width ? size.width * 0.5 : 50}
              cy={0}
              rx={size.width ? size.width * 0.5 : 50}
              ry={size.height ? size.height * 0.5 : 50}
              fill="white"
              fillOpacity={0.6}
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_1_2"
            x={size.width ? -size.width * 0.5 + size.width * 0.5 - 100 : -100}
            y={size.height ? -size.height : -100}
            width={size.width ? size.width * 2 : 300}
            height={size.height ? size.height * 2 : 200}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_1_2" />
          </filter>
          <clipPath id="clip0_1_2">
            <rect width="100%" height="100%" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}


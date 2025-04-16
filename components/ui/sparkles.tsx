"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useMousePosition } from "@/hooks/use-mouse-position"

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#FFF",
  particleDensity = 100,
}: SparklesProps) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const particles = useRef<any[]>([])
  const mousePosition = useMousePosition()
  const mouse = useRef({ x: 0, y: 0 })
  const canvasEl = canvasRef.current
  const randomSize = () => Math.random() * (maxSize - minSize) + minSize

  const render = () => {
    if (context.current && canvasEl) {
      context.current.clearRect(0, 0, canvasSize.width, canvasSize.height)
      context.current.fillStyle = background
      context.current.fillRect(0, 0, canvasSize.width, canvasSize.height)

      particles.current.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(render)
    }
  }

  useEffect(() => {
    if (canvasContainerRef.current) {
      setCanvasSize({
        width: canvasContainerRef.current.offsetWidth,
        height: canvasContainerRef.current.offsetHeight,
      })
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }

    const handleResize = () => {
      if (canvasContainerRef.current) {
        setCanvasSize({
          width: canvasContainerRef.current.offsetWidth,
          height: canvasContainerRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    mouse.current = { x: mousePosition.x || 0, y: mousePosition.y || 0 }
  }, [mousePosition])

  useEffect(() => {
    if (context.current && canvasEl) {
      particles.current = []

      const particleCount = Math.min(
        Math.max(Math.floor((canvasSize.width * canvasSize.height) / 10000) * particleDensity, 25),
        500,
      )

      for (let i = 0; i < particleCount; i++) {
        const size = randomSize()
        particles.current.push(
          new Particle({
            context: context.current,
            width: canvasSize.width,
            height: canvasSize.height,
            size,
            speed,
            particleColor,
            mouse,
          }),
        )
      }

      render()
    }
  }, [canvasSize, particleColor, speed, particleDensity, maxSize, minSize, background])

  return (
    <div ref={canvasContainerRef} className={cn("h-full w-full", className)} aria-hidden="true">
      <canvas id={id} ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
    </div>
  )
}

interface ParticleProps {
  context: CanvasRenderingContext2D
  width: number
  height: number
  size: number
  speed: number
  particleColor: string
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

class Particle {
  context: CanvasRenderingContext2D
  width: number
  height: number
  x: number
  y: number
  size: number
  speed: number
  vx: number
  vy: number
  particleColor: string
  mouse: React.MutableRefObject<{ x: number; y: number }>
  initialSize: number

  constructor({ context, width, height, size, speed, particleColor, mouse }: ParticleProps) {
    this.context = context
    this.width = width
    this.height = height
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.size = size
    this.initialSize = size
    this.speed = speed
    this.vx = (Math.random() - 0.5) * speed
    this.vy = (Math.random() - 0.5) * speed
    this.particleColor = particleColor
    this.mouse = mouse
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > this.width) {
      this.vx = -this.vx
    }
    if (this.y < 0 || this.y > this.height) {
      this.vy = -this.vy
    }

    // Mouse interaction
    const dx = this.x - this.mouse.current.x
    const dy = this.y - this.mouse.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 100

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance
      const angle = Math.atan2(dy, dx)
      const fx = Math.cos(angle) * force * 0.5
      const fy = Math.sin(angle) * force * 0.5

      this.vx += fx
      this.vy += fy

      this.size = this.initialSize * (1 + force)
    } else {
      this.size = this.initialSize
    }

    // Speed limit
    const maxSpeed = 2
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (currentSpeed > maxSpeed) {
      this.vx = (this.vx / currentSpeed) * maxSpeed
      this.vy = (this.vy / currentSpeed) * maxSpeed
    }
  }

  draw() {
    this.context.beginPath()
    this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.context.fillStyle = this.particleColor
    this.context.fill()
  }
}


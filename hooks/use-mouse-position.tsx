"use client"

import { useState, useEffect } from "react"

interface MousePosition {
  x: number | null
  y: number | null
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: null,
    y: null,
  })

  useEffect(() => {
    // Define the handler outside of the effect to avoid recreating it on each render
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Add the event listener
    window.addEventListener("mousemove", updateMousePosition)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  return mousePosition
}


"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TextGenerateEffectProps {
  words: string
  className?: string
}

export const TextGenerateEffect = ({ words, className }: TextGenerateEffectProps) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    if (currentIndex < words.length && isGenerating) {
      const timeout = setTimeout(() => {
        setDisplayedText(words.substring(0, currentIndex + 1))
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, 30) // Adjust speed as needed

      return () => clearTimeout(timeout)
    } else {
      setIsGenerating(false)
    }
  }, [currentIndex, words, isGenerating])

  return (
    <div className={cn("", className)}>
      <p>{displayedText}</p>
      {isGenerating && <span className="inline-block h-4 w-0.5 bg-white ml-0.5 animate-blink" />}
    </div>
  )
}


"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useTransform, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
    }
  }, [])

  const y1 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50])

  const springY1 = useSpring(y1, { stiffness: 500, damping: 90 })
  const springY2 = useSpring(y2, { stiffness: 500, damping: 90 })

  return (
    <motion.div ref={ref} className={cn("relative w-full max-w-4xl mx-auto", className)}>
      <div className="absolute -left-4 md:-left-20 top-0 h-full w-20">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.1,
          }}
          animate={{
            boxShadow: scrollYProgress.get() > 0 ? "none" : "rgba(255, 255, 255, 0.15) 0px 0px 10px 4px",
          }}
          className="sticky top-1/2 left-0 h-4 w-4 rounded-full bg-white z-40"
        />
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="absolute left-0 top-0"
          fill="none"
        >
          <motion.path d={`M 10 0 L 10 ${svgHeight}`} stroke="white" strokeOpacity="0.2" strokeWidth="1" />
          <motion.path d={`M 10 ${springY1} L 10 ${springY2}`} stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div ref={contentRef} className="ml-4 md:ml-8 pt-10 pb-20">
        {children}
      </div>
    </motion.div>
  )
}


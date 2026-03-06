"use client"

import { motion, useReducedMotion } from "framer-motion"

export function GridLines() {
  const prefersReduced = useReducedMotion()

  const variants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
      }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {/* Left vertical line at ~18% */}
      <div className="absolute left-[18%] top-0 h-full w-px bg-foreground opacity-[0.04] lg:opacity-[0.07]" />
      
      {/* Right vertical line at ~82% */}
      <div className="absolute right-[18%] top-0 h-full w-px bg-foreground opacity-[0.04] lg:opacity-[0.07]" />
    </motion.div>
  )
}

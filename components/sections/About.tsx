"use client"

import { motion, useReducedMotion } from "framer-motion"
import { aboutParagraphs, stats } from "@/lib/data"

export function About() {
  const prefersReduced = useReducedMotion()

  const containerVariants: any = {
    hidden: {},
    visible: prefersReduced ? {} : { transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: any = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 50 },
    visible: { opacity: 1, y: 0, transition: prefersReduced ? { duration: 0 } : { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <section id="sobre" className="relative pb-32 pt-32">
      {/* Horizontal divider */}
      <div className="absolute left-6 right-6 top-0 h-px bg-foreground/10" />

      {/* Decorative horizontal line segment */}
      <motion.div
        className="absolute left-[18%] top-16 hidden h-px w-24 bg-foreground/10 lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      />

      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-[40%_60%] lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          {/* Left Column - Title & Stats */}
          <div>
            <motion.div variants={itemVariants}>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-30">
                01 /
              </span>
              <h2 className="mt-2 font-mono text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
                Engenharia antes de elegância.
              </h2>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex items-center gap-0"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 ${i !== 0 ? "border-l border-foreground/10 pl-6" : ""}`}
                >
                  <div className="font-mono text-3xl md:text-4xl">{stat.value}</div>
                  <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest opacity-40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Text & Image */}
          <div className="space-y-6">
            {aboutParagraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className="font-serif text-base leading-relaxed opacity-70 md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Portrait Container */}
            <motion.div variants={itemVariants} className="relative mt-12">
              <div className="relative aspect-4/3 w-full max-w-md overflow-hidden border border-foreground/10 grayscale">
                {/* Placeholder with initials */}
                <div className="flex h-full w-full items-center justify-center bg-foreground/5">
                  <span className="font-mono text-6xl opacity-10">LC</span>
                </div>

                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-foreground/20" />
                <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-foreground/20" />
                <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-foreground/20" />
                <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-foreground/20" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

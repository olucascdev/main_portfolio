"use client"

import { motion, useReducedMotion } from "framer-motion"
import { skills } from "@/lib/data"

export function Skills() {
  const prefersReduced = useReducedMotion()

  const containerVariants = prefersReduced
    ? {}
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }

  const itemVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }

  return (
    <section id="skills" className="relative px-6 pb-32 pt-32">
      {/* Horizontal divider */}
      <div className="absolute left-6 right-6 top-0 h-px bg-foreground/10" />

      {/* Decorative horizontal line segment */}
      <motion.div
        className="absolute left-[18%] top-16 hidden h-px w-20 bg-foreground/10 lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      />

      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-16">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-30">
              03 /
            </span>
            <h2 className="mt-2 font-mono text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              Stack & Ferramentas
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <motion.div
                key={skill.category}
                variants={itemVariants}
                className="group relative border border-foreground/10 p-6 transition-colors duration-150 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                {/* Top accent line */}
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-foreground/20 transition-colors duration-150 group-hover:bg-background" />

                <h3 className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-50 transition-opacity duration-150 group-hover:opacity-100">
                  {skill.category}
                </h3>

                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 font-serif text-base">
                      <span className="opacity-40">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion, useReducedMotion } from "framer-motion"

type Experience = { id: number; period: string; role: string; company: string; description: string; orderIndex: number }

export function Experience({ experiences }: { experiences: Experience[] }) {
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
    <section id="experiencia" className="relative pb-32 pt-32">
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

      <div className="mx-auto max-w-[680px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="font-mono text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              Trajetória.
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-1 top-0 w-px bg-foreground/10" />

            <div className="space-y-12">
              {experiences.map((exp) => (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  className="relative pl-8"
                >
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 h-[6px] w-[6px] rounded-full bg-foreground" />

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-mono text-lg font-medium md:text-xl">{exp.role}</h3>
                    <span className="font-mono text-xs opacity-50">{exp.period}</span>
                  </div>

                  <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-widest opacity-40">
                    {exp.company}
                  </span>

                  <p className="mt-3 font-serif text-sm leading-relaxed opacity-60">
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

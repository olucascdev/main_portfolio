"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useTranslation } from "react-i18next"

export function About() {
  const { t } = useTranslation()
  const prefersReduced = useReducedMotion()

  const containerVariants: any = {
    hidden: {},
    visible: prefersReduced ? {} : { transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: any = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section id="sobre" className="relative pb-32 pt-24 min-h-screen flex items-center">
      <div className="mx-auto w-full grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8 items-center">
        
        {/* Left Column — description only */}
        <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="flex flex-col justify-center"
        >
          <motion.h2 variants={itemVariants} className="mb-6 font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("about.title")}
          </motion.h2>

          <motion.p variants={itemVariants} className="max-w-lg font-serif text-lg leading-relaxed opacity-70">
            {t("about.description")}
          </motion.p>
        </motion.div>

        {/* Right Column — photo only */}
        <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="relative flex flex-col"
        >
          <motion.div variants={itemVariants} className="relative z-10 w-full rounded-4xl border border-foreground/10 overflow-hidden aspect-square">
            <img 
              src="/placeholder-user.jpg" 
              alt="Lucas Correia" 
              className="h-full w-full object-cover object-top"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

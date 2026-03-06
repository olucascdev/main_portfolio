"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

type ContactLink = { id: number; label: string; value: string; href: string; orderIndex: number }

export function Contact({ contactLinks }: { contactLinks: ContactLink[] }) {
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
    <section id="contato" className="relative py-40">
      {/* Horizontal divider */}
      <div className="absolute left-6 right-6 top-0 h-px bg-foreground/10" />

      <div className="mx-auto max-w-[600px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.span
            variants={itemVariants}
            className="font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-30"
          >
            06 /
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-4 font-mono text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl"
          >
            Vamos construir algo.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-md font-serif text-base italic opacity-60"
          >
            Aberto a projetos, colaborações e conversas sobre sistemas.
          </motion.p>

          {/* Contact Links */}
          <motion.div variants={itemVariants} className="mt-16">
            {contactLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group flex items-center justify-between border-b border-foreground/10 py-5 transition-colors duration-150 hover:bg-foreground hover:text-background"
                aria-label={`${link.label}: ${link.value}`}
              >
                <span className="px-4 font-mono text-xs uppercase tracking-widest opacity-50 transition-opacity duration-150 group-hover:opacity-100">
                  {link.label}
                </span>
                <span className="flex items-center gap-2 px-4 font-mono text-sm">
                  {link.value}
                  <ArrowUpRight className="h-4 w-4 opacity-50 transition-opacity duration-150 group-hover:opacity-100" />
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-32 max-w-[600px] border-t border-foreground/10 pt-8">
        <div className="relative text-center">
          {/* Decorative crossing lines */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground opacity-10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground opacity-10" />

          <p className="relative font-mono text-xs opacity-40">
            Desenvolvido com precisão. © 2025 Lucas Correia.
          </p>
        </div>
      </footer>
    </section>
  )
}

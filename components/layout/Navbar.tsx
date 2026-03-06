"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { LanguageToggle } from "@/components/ui/LanguageToggle"
import { useTranslation } from "react-i18next"

const navLinksKeys = [
  { href: "#sobre", key: "nav.about" },
  { href: "#skills", key: "nav.skills" },
  { href: "#projetos", key: "nav.projects" },
  { href: "#experiencia", key: "nav.experience" },
  { href: "#contato", key: "nav.contact" },
]

export function Navbar() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const prefersReduced = useReducedMotion()

  const menuVariants: any = prefersReduced
    ? { hidden: {}, visible: {}, exit: {} }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }

  const linkVariants: any = prefersReduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
        }),
      }

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <a
            href="#"
            className="font-mono text-sm tracking-widest transition-opacity duration-150 hover:opacity-60"
          >
            LC_
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinksKeys.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest opacity-60 transition-opacity duration-150 hover:opacity-100"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-10 items-center justify-center transition-opacity duration-150 hover:opacity-60 md:hidden"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-100 flex flex-col bg-background md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="flex h-16 items-center justify-between border-b border-foreground/10 px-6">
              <span className="font-mono text-sm tracking-widest">LC_</span>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center transition-opacity duration-150 hover:opacity-60"
                aria-label="Fechar menu de navegação"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {navLinksKeys.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-2xl uppercase tracking-widest transition-opacity duration-150 hover:opacity-60"
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {t(link.key)}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

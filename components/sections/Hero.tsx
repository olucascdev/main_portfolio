"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  Github, 
  Linkedin 
} from "lucide-react"
import { useTranslation } from "react-i18next"

const codeSnippet = `package main

import "fmt"

func main() {
\tname := "Lucas Correia"
\trole := "Backend Developer"
\tskills := []string{"Go", "PHP", "Laravel", "Python"}

\tfmt.Printf("Name: %s\\n", name)
\tfmt.Printf("Role: %s\\n", role)
\tfmt.Printf("Skills: %v\\n", skills)
}`

export function Hero() {
  const { t } = useTranslation()
  const prefersReduced = useReducedMotion()
  const [displayedCode, setDisplayedCode] = useState("")

  useEffect(() => {
    if (prefersReduced) {
      setDisplayedCode(codeSnippet)
      return
    }

    let i = 0
    const interval = setInterval(() => {
      setDisplayedCode(codeSnippet.slice(0, i))
      i++
      if (i > codeSnippet.length) {
        clearInterval(interval)
      }
    }, 30) // Typing speed

    return () => clearInterval(interval)
  }, [prefersReduced])

  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.1 },
    },
  }

  const itemVariants: any = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: "easeOut" } },
  }

  const codeVariants: any = {
    hidden: { opacity: prefersReduced ? 1 : 0, x: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, x: 0, transition: prefersReduced ? { duration: 0 } : { delay: 0.5, duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="relative flex min-h-screen items-center pt-24 pb-16">
      <div className="mx-auto grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
        
        {/* === Left Column === */}
        <motion.div
          className="flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Top Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground/70">
              <MapPin className="h-3 w-3" />
              <span>{t("hero.badges.location")}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground/70">
              <Briefcase className="h-3 w-3" />
              <span>{t("hero.badges.role")}</span>
            </div>
          </motion.div>

          <motion.span variants={itemVariants} className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">
            {t("hero.subtitle")}
          </motion.span>

          <motion.h1 
            variants={itemVariants} 
            className="mb-4 font-sans text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Lucas Correia
          </motion.h1>



          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#projetos"
              className="group flex h-12 flex-none items-center justify-center gap-2 rounded-xl bg-foreground px-6 font-sans text-sm font-bold text-background transition-transform hover:scale-[1.02]"
            >
              {t("hero.buttons.projects")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contato"
              className="group flex h-12 flex-none items-center justify-center gap-2 rounded-xl border border-border/60 bg-background px-6 font-sans text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              <span className="font-mono font-medium text-foreground/60 mr-1">&lt; &gt;</span>
              {t("hero.buttons.contact")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Links Below */}
          <motion.div variants={itemVariants} className="space-y-4">
            <span className="block font-sans text-xs font-semibold text-foreground/50">
              {t("hero.social")}
            </span>
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-xs font-bold text-foreground/80 transition-opacity hover:opacity-70">
                <Github className="h-4 w-4" />
                @lucascorreia
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-xs font-bold text-foreground/80 transition-opacity hover:opacity-70">
                <Linkedin className="h-4 w-4" />
                Lucas Correia
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* === Right Column === */}
        <motion.div
           className="relative flex flex-col justify-center"
           initial="hidden"
           animate="visible"
           variants={codeVariants}
        >
          {/* Main Hero Card/Image/Code */}
          <div className="relative z-10 w-full rounded-2xl overflow-hidden border border-foreground/10 bg-background/50 shadow-2xl backdrop-blur-sm p-6 lg:p-8">
            <div className="flex gap-2 mb-6 opacity-30">
              <div className="h-3 w-3 rounded-full bg-foreground shadow-sm"></div>
              <div className="h-3 w-3 rounded-full bg-foreground shadow-sm"></div>
              <div className="h-3 w-3 rounded-full bg-foreground shadow-sm"></div>
            </div>
            
            <pre className="font-mono text-xs md:text-sm leading-loose overflow-x-auto text-foreground/80">
              <code>
                {displayedCode.split("\n").map((line, i) => (
                  <div key={i} className="whitespace-pre">
                    <span className="mr-6 inline-block w-4 text-right opacity-20 select-none">
                      {i + 1}
                    </span>
                    <span className={getLineStyle(line)}>{line}</span>
                    {i === displayedCode.split("\n").length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block bg-foreground ml-1 align-middle"
                        style={{ width: '8px', height: '1.2em' }}
                      />
                    )}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

function getLineStyle(line: string): string {
  if (line.includes("package") || line.includes("import") || line.includes("func")) {
    return "opacity-100 font-semibold"
  }
  if (line.includes("fmt.Printf")) {
    return "opacity-90 font-medium"
  }
  if (line.includes(":=")) {
    return "opacity-80"
  }
  if (line.includes("\"")) {
    return "opacity-60"
  }
  if (line.trim() === "{" || line.trim() === "}") {
    return "opacity-40"
  }
  return "opacity-70"
}

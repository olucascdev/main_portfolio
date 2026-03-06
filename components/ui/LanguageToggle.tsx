"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  // Wait until mounted to avoid hydration differences
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentLang = i18n.language && i18n.language.startsWith('en') ? 'EN' : 'PT'

  const toggleLanguage = () => {
    const nextLang = currentLang === "PT" ? "en" : "pt"
    i18n.changeLanguage(nextLang)
  }

  if (!mounted) return (
    <div className="inline-flex h-10 w-16 items-center justify-center gap-1.5 rounded-md border border-foreground/10 bg-background opacity-50">
      <Globe className="h-4 w-4" />
      <span className="font-mono text-xs font-bold">--</span>
    </div>
  )

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex h-10 w-16 items-center justify-center gap-1.5 rounded-md border border-foreground/10 bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Mudar idioma"
    >
      <Globe className="h-4 w-4 opacity-70" />
      <span className="font-mono text-xs font-bold">{currentLang}</span>
    </button>
  )
}

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/hero", label: "Hero", icon: "⬡" },
  { href: "/admin/about", label: "Sobre", icon: "◉" },
  { href: "/admin/skills", label: "Skills", icon: "◈" },
  { href: "/admin/projects", label: "Projetos", icon: "⬡" },
  { href: "/admin/experiences", label: "Experiência", icon: "◎" },
  { href: "/admin/contact", label: "Contato", icon: "◈" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white/[0.03] border-r border-white/10 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold">A</div>
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-white/40">Portfolio CMS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-white text-black font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
        <Link
          href="/"
          target="_blank"
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Ver portfólio
        </Link>
      </div>
    </aside>
  )
}

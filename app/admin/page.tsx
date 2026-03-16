import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/auth"
import Link from "next/link"

const sections = [
  { href: "/admin/hero", label: "Hero", description: "Nome, título, subtítulo, redes sociais" },
  { href: "/admin/about", label: "Sobre Mim", description: "Parágrafos, CV e foto" },
  { href: "/admin/skills", label: "Skills", description: "Categorias e tecnologias" },
  { href: "/admin/projects", label: "Projetos", description: "Portfólio de projetos" },
  { href: "/admin/experiences", label: "Experiência", description: "Histórico profissional" },
  { href: "/admin/contact", label: "Contato", description: "Links de contato" },
]

export default async function AdminDashboard() {
  const auth = await isAdminAuthenticated()
  if (!auth) redirect("/admin/login")

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Gerencie o conteúdo do seu portfólio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group p-5 bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] rounded-xl transition-all"
          >
            <h2 className="text-sm font-medium text-white group-hover:text-white/90">{s.label}</h2>
            <p className="text-xs text-white/40 mt-1">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

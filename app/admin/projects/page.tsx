"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type Project = {
  id: number
  title: string
  description: string
  tech: string[]
  githubUrl: string
  liveUrl: string
  imageUrl?: string
  orderIndex: number
}

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  tech: [],
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  orderIndex: 0,
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Partial<Project> | null>(null)
  const [techText, setTechText] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const r = await fetch("/api/projects")
    const data = await r.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function authFetch(url: string, opts: RequestInit) {
    const r = await fetch(url, opts)
    if (r.status === 401) { router.push("/admin/login"); return null }
    return r
  }

  async function handleSave() {
    if (!modal) return
    setSaving(true)
    setError("")
    const isEdit = !!modal.id
    const parsedTech = techText.split(",").map((s) => s.trim()).filter(Boolean)
    const r = await authFetch("/api/projects", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...modal, tech: parsedTech, orderIndex: modal.id ? modal.orderIndex : projects.length }),
    })
    if (!r) {
      setSaving(false)
      return
    }
    if (!r.ok) {
      const data = await r.json().catch(() => null)
      setSaving(false)
      setError(data?.error ?? "Nao foi possivel salvar o projeto.")
      return
    }
    setSaving(false)
    setModal(null)
    setTechText("")
    setError("")
    fetchData()
  }

  async function deleteProject(id: number) {
    if (!confirm("Deletar este projeto?")) return
    const r = await authFetch(`/api/projects?id=${id}`, { method: "DELETE" })
    if (r?.ok) fetchData()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projetos</h1>
          <p className="text-white/40 text-sm mt-1">Portfólio de projetos</p>
        </div>
        <button
          onClick={() => {
            setModal({ ...emptyProject })
            setTechText("")
            setError("")
          }}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          + Novo
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="group flex items-start justify-between p-5 bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl transition-all">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{p.title}</p>
              <p className="text-xs text-white/40 mt-0.5 truncate">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs text-white/50 bg-white/5 rounded-md">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <button
                onClick={() => {
                  setModal(p)
                  setTechText(p.tech.join(", "))
                  setError("")
                }}
                className="px-3 py-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >Editar</button>
              <button onClick={() => deleteProject(p.id)} className="px-3 py-1.5 text-xs text-red-400/70 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{modal.id ? "Editar Projeto" : "Novo Projeto"}</h2>
            <Field label="Título" value={modal.title ?? ""} onChange={(v) => setModal({ ...modal, title: v })} />
            <Field label="Descrição" value={modal.description ?? ""} onChange={(v) => setModal({ ...modal, description: v })} textarea />
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Tech (separado por vírgula)</label>
              <input
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                placeholder="Next.js, Go, PostgreSQL"
              />
            </div>
            <Field label="GitHub URL" value={modal.githubUrl ?? ""} onChange={(v) => setModal({ ...modal, githubUrl: v })} />
            <Field label="Live URL" value={modal.liveUrl ?? ""} onChange={(v) => setModal({ ...modal, liveUrl: v })} />
            <Field label="Image URL (opcional)" value={modal.imageUrl ?? ""} onChange={(v) => setModal({ ...modal, imageUrl: v })} />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => { setModal(null); setTechText(""); setError("") }} className="px-4 py-2.5 text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const base = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={base} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      }
    </div>
  )
}

function Loader() {
  return <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
}

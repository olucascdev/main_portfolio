"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type Skill = { id: number; category: string; items: string[]; orderIndex: number }

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Partial<Skill> | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const r = await fetch("/api/skills")
    const data = await r.json()
    setSkills(Array.isArray(data) ? data : [])
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
    const isEdit = !!modal.id
    await authFetch("/api/skills", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...modal,
        items: modal.items ?? [],
        orderIndex: isEdit ? modal.orderIndex : skills.length,
      }),
    })
    setSaving(false)
    setModal(null)
    fetchData()
  }

  async function deleteSkill(id: number) {
    if (!confirm("Deletar esta categoria?")) return
    const r = await authFetch(`/api/skills?id=${id}`, { method: "DELETE" })
    if (r?.ok) fetchData()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Skills</h1>
          <p className="text-white/40 text-sm mt-1">Categorias e tecnologias</p>
        </div>
        <button
          onClick={() => setModal({ category: "", items: [], orderIndex: skills.length })}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors"
        >+ Nova categoria</button>
      </div>

      {skills.length === 0 ? (
        <div className="flex items-center justify-center h-24 border border-dashed border-white/10 rounded-xl text-white/20 text-sm">
          Nenhuma skill ainda
        </div>
      ) : (
        <div className="overflow-hidden border border-white/10 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium">Categoria</th>
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium">Tecnologias</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white/70 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                    {skill.category}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {skill.items.map((item) => (
                        <span key={item} className="px-2 py-0.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal(skill)}
                        className="px-2.5 py-1 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all"
                      >Editar</button>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="px-2.5 py-1 text-xs text-red-400/60 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-md transition-all"
                      >Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────── */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">
              {modal.id ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Nome da categoria</label>
              <input
                value={modal.category ?? ""}
                onChange={(e) => setModal({ ...modal, category: e.target.value })}
                placeholder="BACKEND, DATABASE..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
                Tecnologias <span className="normal-case text-white/20">(separadas por vírgula)</span>
              </label>
              <input
                value={modal.items?.join(", ") ?? ""}
                onChange={(e) => setModal({ ...modal, items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="Go, PHP, Laravel, Python"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
              {/* Preview */}
              {(modal.items?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {modal.items?.map((item) => (
                    <span key={item} className="px-2 py-0.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 disabled:opacity-50 transition-colors">
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => setModal(null)}
                className="px-4 py-2.5 text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Loader() {
  return <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type Experience = {
  id: number
  period: string
  role: string
  company: string
  description: string
  orderIndex: number
}

const emptyExp: Omit<Experience, "id"> = {
  period: "",
  role: "",
  company: "",
  description: "",
  orderIndex: 0,
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Partial<Experience> | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const r = await fetch("/api/experiences")
    const data = await r.json()
    setExperiences(Array.isArray(data) ? data : [])
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
    const r = await authFetch("/api/experiences", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...modal, orderIndex: modal.id ? modal.orderIndex : experiences.length }),
    })
    if (!r) {
      setSaving(false)
      return
    }
    if (!r.ok) {
      const data = await r.json().catch(() => null)
      setSaving(false)
      setError(data?.error ?? "Nao foi possivel salvar a experiencia.")
      return
    }
    setSaving(false)
    setModal(null)
    setError("")
    fetchData()
  }

  async function deleteExperience(id: number) {
    if (!confirm("Deletar esta experiência?")) return
    const r = await authFetch(`/api/experiences?id=${id}`, { method: "DELETE" })
    if (r?.ok) fetchData()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Experiência</h1>
          <p className="text-white/40 text-sm mt-1">Histórico profissional</p>
        </div>
        <button
          onClick={() => {
            setModal({ ...emptyExp })
            setError("")
          }}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          + Nova
        </button>
      </div>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="group flex items-start justify-between p-5 bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl transition-all">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40 font-mono">{exp.period}</p>
              <p className="text-sm font-medium text-white mt-0.5">{exp.role}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{exp.company}</p>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">{exp.description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <button onClick={() => { setModal(exp); setError("") }} className="px-3 py-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">Editar</button>
              <button onClick={() => deleteExperience(exp.id)} className="px-3 py-1.5 text-xs text-red-400/70 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{modal.id ? "Editar Experiência" : "Nova Experiência"}</h2>
            <Field label="Período" value={modal.period ?? ""} onChange={(v) => setModal({ ...modal, period: v })} placeholder="2024 — atual" />
            <Field label="Cargo" value={modal.role ?? ""} onChange={(v) => setModal({ ...modal, role: v })} />
            <Field label="Empresa" value={modal.company ?? ""} onChange={(v) => setModal({ ...modal, company: v })} />
            <Field label="Descrição" value={modal.description ?? ""} onChange={(v) => setModal({ ...modal, description: v })} textarea />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => { setModal(null); setError("") }} className="px-4 py-2.5 text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
  const base = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={base} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />
      }
    </div>
  )
}

function Loader() {
  return <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
}

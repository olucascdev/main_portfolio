"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type ContactLink = {
  id: number
  label: string
  value: string
  href: string
  orderIndex: number
}

const emptyLink: Omit<ContactLink, "id"> = {
  label: "",
  value: "",
  href: "",
  orderIndex: 0,
}

export default function AdminContactPage() {
  const [links, setLinks] = useState<ContactLink[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Partial<ContactLink> | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const r = await fetch("/api/contact")
    const data = await r.json()
    setLinks(Array.isArray(data) ? data : [])
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
    const r = await authFetch("/api/contact", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...modal, orderIndex: modal.id ? modal.orderIndex : links.length }),
    })
    if (!r) {
      setSaving(false)
      return
    }
    if (!r.ok) {
      const data = await r.json().catch(() => null)
      setSaving(false)
      setError(data?.error ?? "Nao foi possivel salvar o contato.")
      return
    }
    setSaving(false)
    setModal(null)
    setError("")
    fetchData()
  }

  async function deleteLink(id: number) {
    if (!confirm("Deletar este link?")) return
    const r = await authFetch(`/api/contact?id=${id}`, { method: "DELETE" })
    if (r?.ok) fetchData()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contato</h1>
          <p className="text-white/40 text-sm mt-1">Links de contato e redes</p>
        </div>
        <button
          onClick={() => {
            setModal({ ...emptyLink })
            setError("")
          }}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          + Novo
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="group flex items-center justify-between p-5 bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl transition-all">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">{link.label}</p>
              <p className="text-sm text-white mt-0.5">{link.value}</p>
              <p className="text-xs text-white/30 mt-0.5 truncate">{link.href}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-4">
              <button onClick={() => { setModal(link); setError("") }} className="px-3 py-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">Editar</button>
              <button onClick={() => deleteLink(link.id)} className="px-3 py-1.5 text-xs text-red-400/70 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{modal.id ? "Editar Link" : "Novo Link"}</h2>
            <Field label="Label" value={modal.label ?? ""} onChange={(v) => setModal({ ...modal, label: v })} placeholder="Email, GitHub..." />
            <Field label="Valor exibido" value={modal.value ?? ""} onChange={(v) => setModal({ ...modal, value: v })} placeholder="lucas@email.com" />
            <Field label="URL / href" value={modal.href ?? ""} onChange={(v) => setModal({ ...modal, href: v })} placeholder="mailto:lucas@..." />
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

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  )
}

function Loader() {
  return <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
}

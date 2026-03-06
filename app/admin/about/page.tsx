"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type Paragraph = { id: number; content: string; orderIndex: number }
type Stat = { id: number; value: string; label: string; orderIndex: number }

export default function AdminAboutPage() {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [paraModal, setParaModal] = useState<Partial<Paragraph> | null>(null)
  const [statModal, setStatModal] = useState<Partial<Stat> | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const r = await fetch("/api/about")
    if (!r.ok) { setLoading(false); return }
    const data = await r.json()
    setParagraphs(Array.isArray(data.paragraphs) ? data.paragraphs : [])
    setStats(Array.isArray(data.stats) ? data.stats : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function authFetch(url: string, opts: RequestInit) {
    const r = await fetch(url, opts)
    if (r.status === 401) { router.push("/admin/login"); return null }
    return r
  }

  async function saveParagraph() {
    if (!paraModal) return
    setSaving(true)
    const isEdit = !!paraModal.id
    await authFetch("/api/about", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "paragraph", ...paraModal, orderIndex: paraModal.orderIndex ?? paragraphs.length }),
    })
    setSaving(false)
    setParaModal(null)
    fetchData()
  }

  async function deleteParagraph(id: number) {
    if (!confirm("Deletar este parágrafo?")) return
    const r = await authFetch(`/api/about?type=paragraph&id=${id}`, { method: "DELETE" })
    if (r?.ok) fetchData()
  }

  async function saveStat() {
    if (!statModal) return
    setSaving(true)
    const isEdit = !!statModal.id
    await authFetch("/api/about", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "stat", ...statModal, orderIndex: statModal.orderIndex ?? stats.length }),
    })
    setSaving(false)
    setStatModal(null)
    fetchData()
  }

  async function deleteStat(id: number) {
    if (!confirm("Deletar esta stat?")) return
    const r = await authFetch(`/api/about?type=stat&id=${id}`, { method: "DELETE" })
    if (r?.ok) fetchData()
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Sobre Mim</h1>
        <p className="text-white/40 text-sm mt-1">Parágrafos e estatísticas da seção About</p>
      </div>

      {/* ── Parágrafos ──────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Parágrafos</h2>
          <button
            onClick={() => setParaModal({ content: "", orderIndex: paragraphs.length })}
            className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-white/90 transition-colors"
          >+ Novo</button>
        </div>

        {paragraphs.length === 0 ? (
          <Empty label="Nenhum parágrafo ainda" />
        ) : (
          <div className="overflow-hidden border border-white/10 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-xs text-white/40 font-medium w-8">#</th>
                  <th className="text-left px-4 py-3 text-xs text-white/40 font-medium">Conteúdo</th>
                  <th className="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody>
                {paragraphs.map((p, idx) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/30 text-xs">{idx + 1}</td>
                    <td className="px-4 py-4 text-white/70 text-xs leading-relaxed max-w-md">
                      <p className="line-clamp-2">{p.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setParaModal(p)}
                          className="px-2.5 py-1 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all"
                        >Editar</button>
                        <button
                          onClick={() => deleteParagraph(p.id)}
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
      </section>

      {/* ── Stats ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Estatísticas</h2>
          <button
            onClick={() => setStatModal({ value: "", label: "", orderIndex: stats.length })}
            className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-white/90 transition-colors"
          >+ Nova</button>
        </div>

        {stats.length === 0 ? (
          <Empty label="Nenhuma estatística ainda" />
        ) : (
          <div className="overflow-hidden border border-white/10 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-xs text-white/40 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 text-xs text-white/40 font-medium">Label</th>
                  <th className="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white font-semibold">{s.value}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{s.label}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setStatModal(s)}
                          className="px-2.5 py-1 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all"
                        >Editar</button>
                        <button
                          onClick={() => deleteStat(s.id)}
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
      </section>

      {/* ── Modal Parágrafo ──────────────────────── */}
      {paraModal !== null && (
        <Modal title={paraModal.id ? "Editar Parágrafo" : "Novo Parágrafo"} onClose={() => setParaModal(null)}>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Conteúdo</label>
            <textarea
              value={paraModal.content ?? ""}
              onChange={(e) => setParaModal({ ...paraModal, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>
          <ModalActions saving={saving} onSave={saveParagraph} onClose={() => setParaModal(null)} />
        </Modal>
      )}

      {/* ── Modal Stat ────────────────────────────── */}
      {statModal !== null && (
        <Modal title={statModal.id ? "Editar Stat" : "Nova Stat"} onClose={() => setStatModal(null)}>
          <Field label="Valor" value={statModal.value ?? ""} onChange={(v) => setStatModal({ ...statModal, value: v })} placeholder="3+" />
          <Field label="Label" value={statModal.label ?? ""} onChange={(v) => setStatModal({ ...statModal, label: v })} placeholder="Anos" />
          <ModalActions saving={saving} onSave={saveStat} onClose={() => setStatModal(null)} />
        </Modal>
      )}
    </div>
  )
}

// ─── Shared ─────────────────────────────────────────────────────────────────

function Loader() {
  return <div className="flex items-center justify-center h-40"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
}

function Empty({ label }: { label: string }) {
  return <div className="flex items-center justify-center h-20 border border-dashed border-white/10 rounded-xl text-white/20 text-sm">{label}</div>
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
    </div>
  )
}

function ModalActions({ saving, onSave, onClose }: { saving: boolean; onSave: () => void; onClose: () => void }) {
  return (
    <div className="flex gap-3 pt-1">
      <button onClick={onSave} disabled={saving}
        className="flex-1 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50">
        {saving ? "Salvando..." : "Salvar"}
      </button>
      <button onClick={onClose}
        className="px-4 py-2.5 text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
        Cancelar
      </button>
    </div>
  )
}

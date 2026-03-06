"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Hero = {
  id?: number
  name: string
  title: string
  subtitle: string
  description: string
  githubUrl: string
  linkedinUrl: string
  cvUrl: string
  imageUrl: string
}

const defaultHero: Hero = {
  name: "",
  title: "",
  subtitle: "",
  description: "",
  githubUrl: "",
  linkedinUrl: "",
  cvUrl: "",
  imageUrl: "",
}

export default function AdminHeroPage() {
  const [form, setForm] = useState<Hero>(defaultHero)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => {
        if (data) setForm(data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const res = await fetch("/api/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.status === 401) {
      router.push("/admin/login")
      return
    }
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <PageHeader title="Hero" description="Seção principal do portfólio" />
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Título" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Field label="Subtítulo" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
        <Field label="Descrição" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
        <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} />
        <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => setForm({ ...form, linkedinUrl: v })} />
        <Field label="CV URL (Link para download)" value={form.cvUrl} onChange={(v) => setForm({ ...form, cvUrl: v })} placeholder="/cv.pdf ou link externo" />
        <Field label="Sobre Mim - Imagem URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="/foto.jpg ou link externo" />
        <div className="flex items-center gap-4 pt-2">
          <SaveButton saving={saving} />
          {saved && <span className="text-green-400 text-sm">Salvo!</span>}
        </div>
      </form>
    </div>
  )
}

// ─── Shared Components ────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )
}

function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="text-white/40 text-sm mt-1">{description}</p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  placeholder?: string
}) {
  const base =
    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={base}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  )
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
    >
      {saving ? "Salvando..." : "Salvar"}
    </button>
  )
}

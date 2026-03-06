import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Strip channel_binding param — not supported by node-postgres driver
const rawUrl = process.env.DATABASE_URL ?? ""
const cleanUrl = rawUrl.replace(/&?channel_binding=[^&]*/g, "").replace(/\?&/, "?")

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
})

const db = drizzle(pool, { schema })

import {
  hero,
  aboutParagraphs,
  aboutStats,
  skills,
  projects,
  experiences,
  contactLinks,
} from "./schema"

async function seed() {
  console.log("🌱 Seeding database...")

  // Hero
  await db.insert(hero).values({
    name: "Lucas Correia",
    title: "Backend Developer",
    subtitle: "Construindo sistemas que escalam",
    description:
      "Especializado em PHP, Laravel, Python e Go. Arquiteturas limpas, tipos fortes, e sistemas que outras pessoas conseguem manter.",
    githubUrl: "https://github.com/lucascorreia",
    linkedinUrl: "https://linkedin.com/in/lucascorreia",
    cvUrl: "/cv.pdf",
  })

  // About Paragraphs
  await db.insert(aboutParagraphs).values([
    {
      content:
        "Acredito que sistemas bem construídos são invisíveis. O backend existe para sustentar experiências — não para aparecer. Minha obsessão é criar infraestruturas que escalam sem atrito, que falham graciosamente, e que outros desenvolvedores conseguem entender sem precisar de mim.",
      orderIndex: 0,
    },
    {
      content:
        "Comecei programando por curiosidade, fiquei por disciplina. Cada projeto é uma oportunidade de resolver um problema real com código que não precisa de explicação. Arquiteturas limpas. Tipos fortes. Testes que documentam intenção.",
      orderIndex: 1,
    },
    {
      content:
        "Quando não estou codando, estou ensinando ou construindo ferramentas que automatizam o trabalho repetitivo. Eficiência não é preguiça — é respeito pelo tempo.",
      orderIndex: 2,
    },
  ])

  // About Stats
  await db.insert(aboutStats).values([
    { value: "3+", label: "Anos", orderIndex: 0 },
    { value: "12+", label: "Projetos", orderIndex: 1 },
    { value: "4", label: "Linguagens", orderIndex: 2 },
  ])

  // Skills
  await db.insert(skills).values([
    { category: "BACKEND", items: ["PHP", "Laravel", "Python", "Go", "Node.js"], orderIndex: 0 },
    { category: "DATABASE", items: ["PostgreSQL", "MySQL", "Redis"], orderIndex: 1 },
    { category: "DEVOPS", items: ["Docker", "GitHub Actions", "Nginx", "VPS", "CI/CD"], orderIndex: 2 },
    { category: "FRONTEND", items: ["Next.js", "Flutter", "Tailwind CSS"], orderIndex: 3 },
    { category: "TOOLS", items: ["n8n", "REST APIs", "Git", "Linux"], orderIndex: 4 },
  ])

  // Projects
  await db.insert(projects).values([
    {
      title: "Praxy Fitness",
      description:
        "SaaS que transforma planilhas de treino em uma interface mobile intuitiva para personal trainers e alunos.",
      tech: ["Laravel", "Flutter", "PostgreSQL", "Redis"],
      githubUrl: "https://github.com/lucascorreia",
      liveUrl: "https://praxy.fitness",
      orderIndex: 0,
    },
    {
      title: "FieldOps",
      description:
        "Sistema de gestão de campo para ISPs com suporte offline-first via PWA e sincronização inteligente.",
      tech: ["Next.js", "Go", "SQLite", "PWA"],
      githubUrl: "https://github.com/lucascorreia",
      liveUrl: "https://fieldops.app",
      orderIndex: 1,
    },
    {
      title: "Coco Fácil",
      description:
        "Assistente de IA conversacional para gestão financeira pessoal com integração bancária.",
      tech: ["Python", "FastAPI", "OpenAI", "n8n"],
      githubUrl: "https://github.com/lucascorreia",
      liveUrl: "https://cocofacil.com.br",
      orderIndex: 2,
    },
    {
      title: "Edully",
      description:
        "Plataforma educacional multi-tenant com gestão de cursos, alunos e certificações automatizadas.",
      tech: ["Laravel", "Vue.js", "MySQL", "Docker"],
      githubUrl: "https://github.com/lucascorreia",
      liveUrl: "https://edully.com",
      orderIndex: 3,
    },
  ])

  // Experiences
  await db.insert(experiences).values([
    {
      period: "2024 — atual",
      role: "Junior Developer",
      company: "STARTUP LOCAL",
      description:
        "Desenvolvimento de soluções em Python, Flutter e automações com n8n para processos internos.",
      orderIndex: 0,
    },
    {
      period: "2023 — atual",
      role: "Professor de TI",
      company: "UNIVC",
      description:
        "Ensino de programação, arquitetura de sistemas e boas práticas de desenvolvimento.",
      orderIndex: 1,
    },
    {
      period: "2023 — atual",
      role: "Founder",
      company: "LUCAS CORREIA TECH — MALÁSIA",
      description:
        "Consultoria em desenvolvimento web, inteligência artificial e automação de processos.",
      orderIndex: 2,
    },
    {
      period: "2022 — 2023",
      role: "Freelance Developer",
      company: "AUTÔNOMO",
      description:
        "Projetos em Laravel, Next.js e automações n8n para clientes diversos.",
      orderIndex: 3,
    },
  ])

  // Contact Links
  await db.insert(contactLinks).values([
    {
      label: "Email",
      value: "lucas@lucascorreia.tech",
      href: "mailto:lucas@lucascorreia.tech",
      orderIndex: 0,
    },
    {
      label: "GitHub",
      value: "github.com/lucascorreia",
      href: "https://github.com/lucascorreia",
      orderIndex: 1,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/lucascorreia",
      href: "https://linkedin.com/in/lucascorreia",
      orderIndex: 2,
    },
  ])

  console.log("✅ Seed complete!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed error:", err)
  process.exit(1)
})

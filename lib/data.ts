export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  github: string
  live: string
  image?: string
}

export interface Skill {
  category: string
  items: string[]
}

export interface Experience {
  period: string
  role: string
  company: string
  description: string
}

export interface ContactLink {
  label: string
  value: string
  href: string
}

export const projects: Project[] = [
  {
    id: "praxy-fitness",
    title: "Praxy Fitness",
    description: "SaaS que transforma planilhas de treino em uma interface mobile intuitiva para personal trainers e alunos.",
    tech: ["Laravel", "Flutter", "PostgreSQL", "Redis"],
    github: "https://github.com/lucascorreia",
    live: "https://praxy.fitness",
  },
  {
    id: "fieldops",
    title: "FieldOps",
    description: "Sistema de gestão de campo para ISPs com suporte offline-first via PWA e sincronização inteligente.",
    tech: ["Next.js", "Go", "SQLite", "PWA"],
    github: "https://github.com/lucascorreia",
    live: "https://fieldops.app",
  },
  {
    id: "coco-facil",
    title: "Coco Fácil",
    description: "Assistente de IA conversacional para gestão financeira pessoal com integração bancária.",
    tech: ["Python", "FastAPI", "OpenAI", "n8n"],
    github: "https://github.com/lucascorreia",
    live: "https://cocofacil.com.br",
  },
  {
    id: "edully",
    title: "Edully",
    description: "Plataforma educacional multi-tenant com gestão de cursos, alunos e certificações automatizadas.",
    tech: ["Laravel", "Vue.js", "MySQL", "Docker"],
    github: "https://github.com/lucascorreia",
    live: "https://edully.com",
  },
]

export const skills: Skill[] = [
  {
    category: "BACKEND",
    items: ["PHP", "Laravel", "Python", "Go", "Node.js"],
  },
  {
    category: "DATABASE",
    items: ["PostgreSQL", "MySQL", "Redis"],
  },
  {
    category: "DEVOPS",
    items: ["Docker", "GitHub Actions", "Nginx", "VPS", "CI/CD"],
  },
  {
    category: "FRONTEND",
    items: ["Next.js", "Flutter", "Tailwind CSS"],
  },
  {
    category: "TOOLS",
    items: ["n8n", "REST APIs", "Git", "Linux"],
  },
]

export const experiences: Experience[] = [
  {
    period: "2024 — atual",
    role: "Junior Developer",
    company: "STARTUP LOCAL",
    description: "Desenvolvimento de soluções em Python, Flutter e automações com n8n para processos internos.",
  },
  {
    period: "2023 — atual",
    role: "Professor de TI",
    company: "UNIVC",
    description: "Ensino de programação, arquitetura de sistemas e boas práticas de desenvolvimento.",
  },
  {
    period: "2023 — atual",
    role: "Founder",
    company: "LUCAS CORREIA TECH — MALÁSIA",
    description: "Consultoria em desenvolvimento web, inteligência artificial e automação de processos.",
  },
  {
    period: "2022 — 2023",
    role: "Freelance Developer",
    company: "AUTÔNOMO",
    description: "Projetos em Laravel, Next.js e automações n8n para clientes diversos.",
  },
]

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "lucas@lucascorreia.tech",
    href: "mailto:lucas@lucascorreia.tech",
  },
  {
    label: "GitHub",
    value: "github.com/lucascorreia",
    href: "https://github.com/lucascorreia",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/lucascorreia",
    href: "https://linkedin.com/in/lucascorreia",
  },
]

export const stats = [
  { value: "3+", label: "Anos" },
  { value: "12+", label: "Projetos" },
  { value: "4", label: "Linguagens" },
]

export const aboutParagraphs = [
  "Acredito que sistemas bem construídos são invisíveis. O backend existe para sustentar experiências — não para aparecer. Minha obsessão é criar infraestruturas que escalam sem atrito, que falham graciosamente, e que outros desenvolvedores conseguem entender sem precisar de mim.",
  "Comecei programando por curiosidade, fiquei por disciplina. Cada projeto é uma oportunidade de resolver um problema real com código que não precisa de explicação. Arquiteturas limpas. Tipos fortes. Testes que documentam intenção.",
  "Quando não estou codando, estou ensinando ou construindo ferramentas que automatizam o trabalho repetitivo. Eficiência não é preguiça — é respeito pelo tempo.",
]

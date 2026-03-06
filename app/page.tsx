import { db } from "@/db"
import {
  hero,
  aboutParagraphs,
  aboutStats,
  skills,
  projects,
  experiences,
  contactLinks,
} from "@/db/schema"
import { asc } from "drizzle-orm"
import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Skills } from "@/components/sections/Skills"
import { Projects } from "@/components/sections/Projects"
import { Experience } from "@/components/sections/Experience"
import { Contact } from "@/components/sections/Contact"

export const dynamic = "force-dynamic"

async function getData() {
  try {
    const [heroData, paragraphs, stats, skillsData, projectsData, experiencesData, contactData] =
      await Promise.all([
        db.select().from(hero).limit(1),
        db.select().from(aboutParagraphs).orderBy(asc(aboutParagraphs.orderIndex)),
        db.select().from(aboutStats).orderBy(asc(aboutStats.orderIndex)),
        db.select().from(skills).orderBy(asc(skills.orderIndex)),
        db.select().from(projects).orderBy(asc(projects.orderIndex)),
        db.select().from(experiences).orderBy(asc(experiences.orderIndex)),
        db.select().from(contactLinks).orderBy(asc(contactLinks.orderIndex)),
      ])
    return {
      hero: heroData[0] ?? null,
      paragraphs,
      stats,
      skills: skillsData,
      projects: projectsData,
      experiences: experiencesData,
      contactLinks: contactData,
    }
  } catch {
    // Fallback to static data if DB not yet configured
    const { projects: staticProjects, skills: staticSkills, experiences: staticExperiences, contactLinks: staticContactLinks, aboutParagraphs: staticParagraphs, stats: staticStats } = await import("@/lib/data")
    return {
      hero: null,
      paragraphs: staticParagraphs.map((c, i) => ({ id: i, content: c, orderIndex: i })),
      stats: staticStats.map((s, i) => ({ id: i, value: s.value, label: s.label, orderIndex: i })),
      skills: staticSkills.map((s, i) => ({ id: i, category: s.category, items: s.items, orderIndex: i })),
      projects: staticProjects.map((p, i) => ({ id: i, title: p.title, description: p.description, tech: p.tech, githubUrl: p.github, liveUrl: p.live, imageUrl: "", orderIndex: i })),
      experiences: staticExperiences.map((e, i) => ({ id: i, period: e.period, role: e.role, company: e.company, description: e.description, orderIndex: i })),
      contactLinks: staticContactLinks.map((l, i) => ({ id: i, label: l.label, value: l.value, href: l.href, orderIndex: i })),
    }
  }
}

export default async function Home() {
  const data = await getData()

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-10 mx-auto max-w-[1200px] border-x border-dashed border-foreground/20 bg-background px-8 md:px-16 lg:px-20">
        <Hero heroData={data.hero} />
        <About paragraphs={data.paragraphs} stats={data.stats} cvUrl={data.hero?.cvUrl} imageUrl={data.hero?.imageUrl} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience experiences={data.experiences} />
        <Contact contactLinks={data.contactLinks} />
      </main>
    </>
  )
}

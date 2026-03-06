import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Skills } from "@/components/sections/Skills"
import { Projects } from "@/components/sections/Projects"
import { Experience } from "@/components/sections/Experience"
import { Contact } from "@/components/sections/Contact"

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-10 mx-auto max-w-[1200px] border-x border-dashed border-foreground/20 bg-background px-8 md:px-16 lg:px-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}

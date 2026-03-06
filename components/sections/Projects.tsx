"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

type Project = { id: number; title: string; description: string; tech: string[]; githubUrl: string; liveUrl: string; imageUrl?: string | null; orderIndex: number }

export function Projects({ projects }: { projects: Project[] }) {
  const prefersReduced = useReducedMotion()

  const containerVariants: any = {
    hidden: {},
    visible: prefersReduced ? {} : { transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: any = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 50 },
    visible: { opacity: 1, y: 0, transition: prefersReduced ? { duration: 0 } : { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <section id="projetos" className="relative pb-32 pt-32">
      {/* Horizontal divider */}
      <div className="absolute left-6 right-6 top-0 h-px bg-foreground/10" />

      {/* Decorative horizontal line segment */}
      <motion.div
        className="absolute right-[18%] top-16 hidden h-px w-28 bg-foreground/10 lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      />

      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-16">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-30">
              04 /
            </span>
            <h2 className="mt-2 font-mono text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
              Coisas que construí.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {projects.map((project) => (
              <motion.article
                key={project.id}
                variants={itemVariants}
                className="group border border-foreground/10"
              >
                {/* Image Area */}
                <div className="relative aspect-video overflow-hidden bg-foreground/5 transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                  <div className="absolute inset-0 flex items-center justify-center grayscale transition-all duration-300 group-hover:grayscale-20">
                    <span className="font-mono text-4xl opacity-10">{project.title}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-mono text-xl font-medium md:text-2xl">{project.title}</h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed opacity-60">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="border border-current px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-6 flex gap-6 border-t border-foreground/10 pt-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest opacity-60 transition-opacity duration-150 hover:opacity-100"
                      aria-label={`Ver código fonte de ${project.title} no GitHub`}
                    >
                      GitHub
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest opacity-60 transition-opacity duration-150 hover:opacity-100"
                      aria-label={`Ver projeto ${project.title} ao vivo`}
                    >
                      Live
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

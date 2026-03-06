"use client"

import { motion, useReducedMotion } from "framer-motion"

const codeSnippet = `<?php

namespace App\\Services;

final class PaymentGateway
{
    public function __construct(
        private readonly HttpClient $http,
        private readonly Logger $logger,
    ) {}

    public function process(
        Transaction $transaction
    ): Result {
        $this->logger->info(
            'Processing transaction',
            ['id' => $transaction->id]
        );

        return $this->http
            ->post('/payments', $transaction)
            ->then(fn($r) => Result::ok($r))
            ->catch(fn($e) => Result::err($e));
    }
}`

export function Hero() {
  const prefersReduced = useReducedMotion()

  const containerVariants = prefersReduced
    ? {}
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.15 },
        },
      }

  const itemVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }

  const codeVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.5, duration: 0.6, ease: "easeOut" } },
      }

  return (
    <section className="relative flex min-h-screen items-center px-6 pt-16">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-[55%_45%]">
        {/* Text Content */}
        <motion.div
          className="relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.span
            variants={itemVariants}
            className="mb-4 block font-mono text-[0.65rem] uppercase tracking-[0.15em] opacity-40"
          >
            Backend Developer · Disponível para projetos
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mb-6 font-mono text-5xl font-medium leading-none tracking-tight md:text-7xl lg:text-8xl xl:text-[10vw] xl:max-w-none"
          >
            Lucas
            <br />
            Correia
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-md font-serif text-lg italic opacity-70 md:text-xl"
          >
            Eu construo os sistemas que sustentam o que as pessoas veem.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <a
              href="#contato"
              className="inline-flex items-center justify-center bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-all duration-150 hover:bg-background hover:text-foreground hover:ring-1 hover:ring-foreground"
            >
              Entrar em contato
            </a>
            <a
              href="#projetos"
              className="inline-flex items-center justify-center border border-foreground/20 bg-transparent px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-150 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Ver projetos
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-0 left-0 hidden flex-col items-center gap-2 lg:flex"
            style={{ bottom: "-80px" }}
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-40">
              scroll
            </span>
            <motion.div
              className="h-10 w-px bg-foreground"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Code Block - Desktop Only */}
        <motion.div
          className="relative hidden lg:block"
          initial="hidden"
          animate="visible"
          variants={codeVariants}
        >
          <div className="relative overflow-hidden border border-foreground/10 bg-background p-6">
            {/* Scanline overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  currentColor 1px,
                  currentColor 2px
                )`,
                backgroundSize: "100% 4px",
              }}
            />
            <pre className="font-mono text-xs leading-relaxed md:text-sm">
              <code>
                {codeSnippet.split("\n").map((line, i) => (
                  <div key={i} className="whitespace-pre">
                    <span className="mr-4 inline-block w-6 text-right opacity-20">
                      {i + 1}
                    </span>
                    <span className={getLineStyle(line)}>{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function getLineStyle(line: string): string {
  if (line.includes("<?php") || line.includes("namespace") || line.includes("final class") || line.includes("public function") || line.includes("private readonly") || line.includes("return") || line.includes("fn(")) {
    return "opacity-100"
  }
  if (line.includes("//") || line.includes("*")) {
    return "opacity-30"
  }
  if (line.trim() === "{" || line.trim() === "}" || line.trim() === "") {
    return "opacity-40"
  }
  return "opacity-70"
}

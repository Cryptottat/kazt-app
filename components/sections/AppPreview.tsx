"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useJuice } from "@/hooks/useJuice";
import { features } from "@/lib/features";

export default function AppPreview() {
  const { triggerHit } = useJuice();

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(var(--color-forge-orange) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-forge-orange) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forge-orange/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-display text-[10px] tracking-[0.3em] text-forge-orange uppercase pixel-border-orange px-4 py-1.5 bg-forge-orange/10 mb-4">
            The Forge UI
          </span>
          <h2 className="font-display text-lg sm:text-xl md:text-2xl text-text-primary uppercase leading-relaxed">
            No Rust. No CLI.<br />
            <span className="text-forge-orange" style={{ textShadow: "0 0 16px rgba(249,115,22,0.3)" }}>Just pure logic.</span>
          </h2>
          <p className="mt-4 text-sm text-text-secondary max-w-2xl mx-auto">
            Build institutional-grade MEV protection in minutes. Connect rule blocks, simulate against real transactions, and deploy the execution layer that burns $KAZT.
          </p>
        </motion.div>

        {/* App Mockup Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pixel-border bg-bg-card/80 backdrop-blur-md rounded-lg overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]"
        >
          {/* Window Header */}
          <div className="flex items-center px-4 py-3 border-b border-wire-border bg-bg-elevated">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-crack-red/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-cast-green/80" />
            </div>
            <div className="mx-auto font-mono text-[10px] text-text-muted tracking-widest">
              kazt.fun/forge
            </div>
          </div>

          {/* Window Body (Canvas Mockup) */}
          <div className="relative h-[400px] sm:h-[500px] w-full bg-bg overflow-hidden flex">
            
            {/* Sidebar Mock */}
            <div className="hidden sm:flex w-48 border-r border-wire-border bg-bg-elevated flex-col p-4">
              <div className="font-display text-[10px] text-text-muted uppercase tracking-wider mb-4">Blocks</div>
              <div className="space-y-2">
                {['Ordering', 'Batching', 'Matching', 'Priority', 'Filter'].map((type, i) => (
                  <div key={type} className="px-3 py-2 text-xs font-mono text-text-secondary border border-wire-border bg-bg/50 cursor-not-allowed opacity-70">
                    + {type}
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Mock */}
            <div className="flex-1 relative">
              {/* Grid */}
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle, var(--color-wire-border) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }} />

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                  d="M 150 150 C 250 150, 250 250, 350 250"
                  stroke="var(--color-forge-orange)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.path
                  d="M 150 150 C 250 150, 250 80, 350 80"
                  stroke="var(--color-crack-red)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </svg>

              {/* Node 1: Filter */}
              <motion.div 
                className="absolute top-[110px] left-[20px] sm:left-[50px] w-48 bg-bg-card border border-crack-red/50 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="px-3 py-1.5 bg-crack-red/20 border-b border-crack-red/30 flex justify-between items-center">
                  <span className="font-display text-[10px] text-crack-red uppercase">Filter</span>
                  <span className="text-xs">⊘</span>
                </div>
                <div className="p-3">
                  <div className="text-xs text-text-primary font-mono mb-1">Sandwich Guard</div>
                  <div className="text-[9px] text-text-muted">Blocks known MEV bots</div>
                </div>
              </motion.div>

              {/* Node 2: Ordering */}
              <motion.div 
                className="absolute top-[210px] left-[220px] sm:left-[350px] w-48 bg-bg-card border border-forge-orange/50 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="px-3 py-1.5 bg-forge-orange/20 border-b border-forge-orange/30 flex justify-between items-center">
                  <span className="font-display text-[10px] text-forge-orange uppercase">Ordering</span>
                  <span className="text-xs">↕</span>
                </div>
                <div className="p-3">
                  <div className="text-xs text-text-primary font-mono mb-1">Price-Time Priority</div>
                  <div className="text-[9px] text-text-muted">Standard CLOB sorting</div>
                </div>
              </motion.div>

              {/* Node 3: Dropped TX (Visual flair) */}
              <motion.div 
                className="absolute top-[50px] left-[220px] sm:left-[350px] w-40 bg-bg/80 border border-wire-border opacity-50"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <div className="p-2 text-center">
                  <div className="text-[10px] text-crack-red font-mono">TX Dropped</div>
                </div>
              </motion.div>

              {/* Floating Simulation Panel */}
              <motion.div
                className="absolute bottom-4 right-4 w-56 bg-bg-elevated border border-wire-border shadow-2xl p-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-[10px] text-text-secondary uppercase">Simulation</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cast-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cast-green"></span>
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[9px]">
                  <div className="flex justify-between text-text-muted"><span>TX_8a9f...</span><span className="text-crack-red">FILTERED</span></div>
                  <div className="flex justify-between text-text-muted"><span>TX_2b4c...</span><span className="text-cast-green">PASSED</span></div>
                  <div className="flex justify-between text-text-muted"><span>TX_9f1e...</span><span className="text-cast-green">PASSED</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA below mockup */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          {features.forge ? (
            <Link
              href="/forge"
              onMouseDown={(e) => triggerHit(e)}
              className="juice-btn inline-block px-8 py-3 bg-forge-orange text-bg font-display uppercase text-xs tracking-wider hover:bg-forge-orange-light transition-colors"
            >
              Try Rule Forge
            </Link>
          ) : (
            <span className="juice-btn-secondary inline-block px-8 py-3 pixel-border text-text-muted font-display uppercase text-xs tracking-wider bg-bg/40">
              Forge Opening Soon
            </span>
          )}
        </motion.div>
      </div>
    </section>
  );
}

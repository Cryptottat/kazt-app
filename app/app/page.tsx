"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const PLATFORMS = [
  {
    name: "Windows",
    file: "Kazt-Setup-0.1.0.exe",
    size: "74.2 MB",
    arch: "x64",
    minOs: "Windows 10+",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12V6.5l8-1.1V12H3zm0 .5V18l8 1.1V12.5H3zm9-1.6V5.3l9-1.3v8.5h-9zM12 12.5v6.7l9 1.3v-8h-9z" />
      </svg>
    ),
  },
  {
    name: "Linux",
    file: "kazt-0.1.0-x86_64.AppImage",
    size: "68.8 MB",
    arch: "x86_64",
    minOs: "Ubuntu 20.04+ / Fedora 36+",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.37 1.884 1.59.774.2 1.503.088 2.083-.2.146-.07.155-.025.24-.126a.559.559 0 00.217-.344c.402-.916.34-2.186-.08-3.196l.005-.003c.012-.09.03-.156.043-.218.184-.883-.095-1.783-.47-2.535-.39-.78-.862-1.43-1.082-1.892a6.2 6.2 0 00-.795-1.14c-.34-.444-.748-.842-.938-1.383a2.4 2.4 0 01-.1-.605c.012-.63.23-1.158.514-1.664.19-.344.292-.7.292-1.098V6.498c0-1.31-.135-2.798-.756-3.96-.467-.877-1.2-1.57-2.297-1.916A5.21 5.21 0 0012.504 0z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "Local Rule Forge",
    desc: "Build ACE rules offline with the same visual canvas as the web app.",
    icon: "anvil",
  },
  {
    title: "CLI Integration",
    desc: "Import/export rulesets from the command line. Script your workflow.",
    icon: "terminal",
  },
  {
    title: "Batch Simulation",
    desc: "Run 10,000+ TX simulations locally without rate limits.",
    icon: "chart",
  },
  {
    title: "Direct Deploy",
    desc: "Deploy rules to Solana directly from the desktop client.",
    icon: "deploy",
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  anvil: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 14h16M7 14V8a3 3 0 013-3h4a3 3 0 013 3v6M5 14v4a1 1 0 001 1h12a1 1 0 001-1v-4" />
    </svg>
  ),
  terminal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 17l6-5-6-5M12 19h8" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v18h18M7 16l4-4 4 4 5-6" />
    </svg>
  ),
  deploy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
    </svg>
  ),
};

export default function AppPage() {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-bg">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-forge-orange/[0.03] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-forge-orange/8 rounded-full blur-[250px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block font-display text-[10px] tracking-[0.3em] text-forge-orange uppercase pixel-border-orange px-4 py-1.5 bg-forge-orange/10 mb-6">
              Desktop App
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-xl sm:text-2xl md:text-3xl text-text-primary uppercase leading-relaxed"
          >
            Forge rules.<br />
            <span
              className="text-forge-orange"
              style={{ textShadow: "0 0 20px rgba(249,115,22,0.4)" }}
            >
              On your machine.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 font-mono text-xs text-text-secondary tracking-wide max-w-lg mx-auto"
          >
            The Kazt desktop client brings the full rule forge experience offline.
            Build, simulate, and deploy ACE rules without browser limitations.
          </motion.p>
        </div>
      </section>

      {/* Download Cards */}
      <section className="relative px-4 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              onMouseEnter={() => setHoveredPlatform(p.name)}
              onMouseLeave={() => setHoveredPlatform(null)}
              className="relative pixel-border bg-bg-card/60 p-6 group"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-forge-orange/40 via-forge-orange to-forge-orange/40 opacity-50" />

              {/* Platform icon + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-text-secondary group-hover:text-forge-orange transition-colors">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-display text-xs uppercase tracking-wider text-text-primary">
                    {p.name}
                  </h3>
                  <p className="font-mono text-[10px] text-text-muted mt-0.5">{p.arch}</p>
                </div>
              </div>

              {/* File info */}
              <div className="mb-5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-text-muted" />
                  <span className="font-mono text-[10px] text-text-secondary">{p.file}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-text-muted" />
                  <span className="font-mono text-[10px] text-text-secondary">{p.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-text-muted" />
                  <span className="font-mono text-[10px] text-text-secondary">{p.minOs}</span>
                </div>
              </div>

              {/* Download button — disabled */}
              <button
                disabled
                className="w-full px-4 py-2.5 pixel-border font-display uppercase text-[10px] tracking-wider text-text-muted bg-bg/40 cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Download
              </button>

              {/* Hover glow */}
              {hoveredPlatform === p.name && (
                <div className="absolute inset-0 pointer-events-none bg-forge-orange/[0.02] transition-opacity" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Version info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-3xl mx-auto mt-6 text-center"
        >
          <p className="font-mono text-[10px] text-text-muted">
            v0.1.0-beta &middot; Requires 4GB RAM &middot; 200MB disk space
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-wire-border to-transparent" />

      {/* Features grid */}
      <section className="relative py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="font-display text-sm sm:text-base uppercase tracking-wider text-text-primary">
              Why desktop?
            </h2>
            <p className="mt-2 font-mono text-[11px] text-text-secondary">
              Everything the web forge does, plus more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="pixel-border bg-bg-card/40 p-5 hover:border-forge-orange/20 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-text-muted group-hover:text-forge-orange transition-colors">
                    {ICON_MAP[f.icon]}
                  </div>
                  <div>
                    <h3 className="font-display text-[10px] uppercase tracking-wider text-text-primary">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-[10px] text-text-secondary leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-wire-border to-transparent" />

      {/* Screenshot preview */}
      <section className="relative py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pixel-border bg-bg-card/30 p-3 sm:p-4"
          >
            {/* Fake window titlebar */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-crack-red/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-molten-gold/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-cast-green/60" />
              </div>
              <span className="font-mono text-[9px] text-text-muted ml-2">Kazt Desktop — Rule Forge</span>
            </div>

            {/* Fake app content */}
            <div className="bg-bg/80 pixel-border p-6 sm:p-8 min-h-[200px] sm:min-h-[280px] flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4 opacity-40">
                  <Image src="/images/logo.png" alt="" fill className="object-contain pixel-render" sizes="64px" />
                </div>
                <p className="font-display text-[10px] text-text-muted uppercase tracking-wider">
                  Preview coming soon
                </p>
                <p className="font-mono text-[9px] text-text-muted/60 mt-2">
                  Desktop app is currently in development
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

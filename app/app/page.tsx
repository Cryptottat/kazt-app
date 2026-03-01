"use client";

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
    title: "Describe, Don't Code",
    desc: "Tell Kazt what your program should do in plain language. The AI handles architecture, accounts, instructions — everything.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    title: "Full Build Pipeline",
    desc: "Generates Anchor programs, writes tests, compiles, and resolves errors automatically. From idea to deployable in minutes.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 17l6-5-6-5M12 19h8" />
      </svg>
    ),
  },
  {
    title: "Local & Devnet Testing",
    desc: "Runs your program on local validator and devnet automatically. Catches bugs before they ever touch mainnet.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4M3 3v18h18M7 16l4-4 4 4 5-6" />
      </svg>
    ),
  },
  {
    title: "One-Click Deploy",
    desc: "When tests pass, deploy to Solana mainnet with a single click. Program upgrades and authority management included.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
      </svg>
    ),
  },
];

export default function AppPage() {
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
            Say what you need.<br />
            <span
              className="text-forge-orange"
              style={{ textShadow: "0 0 20px rgba(249,115,22,0.4)" }}
            >
              Kazt builds it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 font-mono text-xs text-text-secondary tracking-wide max-w-xl mx-auto leading-relaxed"
          >
            Describe your Solana program in plain language. Kazt generates the code,
            compiles it, runs tests on local validator and devnet, and deploys — all automatically.
            Anyone can build and ship on Solana.
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
              className="relative pixel-border bg-bg-card/60 p-6 group hover:border-forge-orange/30 transition-all duration-200"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-forge-orange/40 via-forge-orange to-forge-orange/40 opacity-50 group-hover:opacity-100 transition-opacity" />

              {/* Hover glow */}
              <div className="absolute inset-0 pointer-events-none bg-forge-orange/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />

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
                  <span className="w-1.5 h-1.5 bg-text-muted group-hover:bg-forge-orange/50 transition-colors" />
                  <span className="font-mono text-[10px] text-text-secondary">{p.file}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-text-muted group-hover:bg-forge-orange/50 transition-colors" />
                  <span className="font-mono text-[10px] text-text-secondary">{p.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-text-muted group-hover:bg-forge-orange/50 transition-colors" />
                  <span className="font-mono text-[10px] text-text-secondary">{p.minOs}</span>
                </div>
              </div>

              {/* Download button — disabled but hover-reactive */}
              <button
                disabled
                className="w-full px-4 py-2.5 pixel-border font-display uppercase text-[10px] tracking-wider bg-bg/40 flex items-center justify-center gap-2 transition-all duration-200 text-text-muted group-hover:text-forge-orange/70 group-hover:border-forge-orange/20 group-hover:bg-forge-orange/[0.04]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:translate-y-0.5">
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Download
              </button>
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

      {/* How it works */}
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
              How it works
            </h2>
            <p className="mt-2 font-mono text-[11px] text-text-secondary">
              From idea to mainnet in four steps.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-3">
            {[
              { step: "01", text: "\"I need a token vesting program with cliff period and linear unlock\"" },
              { step: "02", text: "Kazt generates Anchor program, accounts, instructions, and test suite" },
              { step: "03", text: "Automated build → local validator test → devnet deployment → all tests pass" },
              { step: "04", text: "One click to deploy on mainnet. Done." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="flex items-start gap-4 pixel-border bg-bg-card/30 p-4 hover:border-forge-orange/15 transition-colors group"
              >
                <span className="font-display text-[10px] text-forge-orange/60 group-hover:text-forge-orange transition-colors mt-0.5 flex-shrink-0">
                  {s.step}
                </span>
                <p className="font-mono text-[11px] text-text-secondary leading-relaxed">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
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
              Features
            </h2>
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
                    {f.icon}
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
              <span className="font-mono text-[9px] text-text-muted ml-2">Kazt Desktop</span>
            </div>

            {/* Fake app content — terminal style */}
            <div className="bg-bg/80 pixel-border p-5 sm:p-6 min-h-[200px] sm:min-h-[260px] font-mono text-[10px] leading-relaxed">
              <p className="text-text-muted">$ kazt</p>
              <p className="text-cast-green mt-2">Kazt v0.1.0 ready.</p>
              <p className="text-text-secondary mt-3">
                <span className="text-forge-orange">{">"}</span> Build me a token vesting program with 6-month cliff
                and 24-month linear unlock. Include admin controls for
                pausing and revoking.
              </p>
              <p className="text-molten-gold mt-3">Generating program...</p>
              <p className="text-text-muted mt-1">├─ programs/vesting/src/lib.rs</p>
              <p className="text-text-muted">├─ programs/vesting/src/state.rs</p>
              <p className="text-text-muted">├─ programs/vesting/src/instructions/</p>
              <p className="text-text-muted">├─ tests/vesting.ts</p>
              <p className="text-text-muted">└─ Anchor.toml</p>
              <p className="text-cast-green mt-3">Build succeeded. Running 12 tests on local validator...</p>
              <p className="text-cast-green">All tests passed. Deploying to devnet...</p>
              <p className="text-cast-green mt-1">
                Program deployed: <span className="text-forge-orange">Vest...7kXp</span>
              </p>
              <p className="text-text-secondary mt-3 animate-pulse">█</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

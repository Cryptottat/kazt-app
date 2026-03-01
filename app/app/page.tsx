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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.37 1.884 1.59.774.2 1.503.088 2.083-.2.146-.07.155-.025.24-.126a.559.559 0 00.217-.344c.402-.916.34-2.186-.08-3.196l.005-.003c.012-.09.03-.156.043-.218.184-.883-.095-1.783-.47-2.535-.39-.78-.862-1.43-1.082-1.892a6.2 6.2 0 00-.795-1.14c-.34-.444-.748-.842-.938-1.383a2.4 2.4 0 01-.1-.605c.012-.63.23-1.158.514-1.664.19-.344.292-.7.292-1.098V6.498c0-1.31-.135-2.798-.756-3.96-.467-.877-1.2-1.57-2.297-1.916A5.21 5.21 0 0012.504 0z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "Describe, Don't Code",
    desc: "Tell Kazt what your program should do in plain language. AI handles architecture, accounts, instructions, and tests.",
  },
  {
    title: "Full Build Pipeline",
    desc: "Generates Anchor programs, compiles, resolves errors, and iterates with you until everything passes.",
  },
  {
    title: "Auto Test & Deploy",
    desc: "Local validator → devnet → mainnet. Automated testing at every stage. One click to go live.",
  },
  {
    title: "Web & API Bridge",
    desc: "Connect to kazt.fun via MCP and API. Sync rules, push templates, manage deployments from desktop.",
    beta: true,
  },
  {
    title: "Template Marketplace",
    desc: "Publish programs you built as templates. Sell on the marketplace. Buy proven programs from other builders.",
  },
  {
    title: "Interactive Build",
    desc: "Kazt asks clarifying questions, suggests patterns, and lets you refine step-by-step. Not a black box.",
  },
];

/* ── Block cards for the fake app UI ── */
const PREVIEW_BLOCKS = [
  { label: "Token Mint", type: "account", color: "#F97316" },
  { label: "Vesting Vault", type: "account", color: "#F59E0B" },
  { label: "Initialize", type: "instruction", color: "#10B981" },
  { label: "Claim", type: "instruction", color: "#10B981" },
  { label: "Revoke", type: "instruction", color: "#EF4444" },
];

export default function AppPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-12 px-4 overflow-hidden">
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
            <span className="text-forge-orange" style={{ textShadow: "0 0 20px rgba(249,115,22,0.4)" }}>
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
            builds it, runs tests, and deploys — all automatically.
            Anyone can create and ship a Solana program.
          </motion.p>
        </div>
      </section>

      {/* ── App Preview: Card UI + Terminal combined ── */}
      <section className="relative px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pixel-border bg-bg-card/40 p-2 sm:p-3 overflow-hidden"
          >
            {/* Window titlebar */}
            <div className="flex items-center gap-2 mb-2 px-2 py-1">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-crack-red/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-molten-gold/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-cast-green/60" />
              </div>
              <span className="font-mono text-[9px] text-text-muted ml-2">Kazt Desktop — Token Vesting Program</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cast-green rounded-full" />
                  <span className="font-mono text-[8px] text-cast-green">connected</span>
                </span>
              </div>
            </div>

            {/* Split layout: cards left + sidebar right */}
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Main area: generated blocks + terminal */}
              <div className="flex-1 space-y-2">
                {/* Generated program blocks */}
                <div className="bg-bg/60 pixel-border p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Generated Program Structure</span>
                    <span className="font-mono text-[8px] text-cast-green px-2 py-0.5 bg-cast-green/10 border border-cast-green/20">build passed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PREVIEW_BLOCKS.map((b) => (
                      <div
                        key={b.label}
                        className="pixel-border px-3 py-2 bg-bg-card/80 flex items-center gap-2 min-w-[100px]"
                        style={{ borderColor: `${b.color}30` }}
                      >
                        <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: b.color }} />
                        <div>
                          <p className="font-mono text-[10px] text-text-primary">{b.label}</p>
                          <p className="font-mono text-[8px] text-text-muted">{b.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Connection lines hint */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-forge-orange/30 via-molten-gold/20 to-cast-green/30" />
                    <span className="font-mono text-[8px] text-text-muted">5 accounts &middot; 3 instructions &middot; 12 tests</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-cast-green/30 via-molten-gold/20 to-forge-orange/30" />
                  </div>
                </div>

                {/* Terminal */}
                <div className="bg-bg/80 pixel-border p-3 sm:p-4 font-mono text-[10px] leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider">Terminal</span>
                  </div>
                  <p className="text-text-secondary">
                    <span className="text-forge-orange">{">"}</span> Build me a token vesting program with 6-month cliff
                    and 24-month linear unlock. Include admin controls.
                  </p>
                  <p className="text-molten-gold mt-2">Analyzing requirements...</p>
                  <p className="text-text-muted mt-1">Creating accounts: TokenMint, VestingVault, VestingSchedule</p>
                  <p className="text-text-muted">Creating instructions: initialize, claim, revoke</p>
                  <p className="text-text-muted">Generating test suite: 12 test cases</p>
                  <p className="text-cast-green mt-2">Build succeeded. All 12 tests passed on local validator.</p>
                  <p className="text-cast-green">Devnet deploy: <span className="text-forge-orange">Vest...7kXp</span> <span className="text-text-muted">(confirmed)</span></p>
                  <p className="text-text-secondary mt-2">
                    <span className="text-forge-orange">{">"}</span> Add a whitelist check to the claim instruction
                  </p>
                  <p className="text-molten-gold">Updating program... rebuilding... 13 tests passed.</p>
                  <p className="text-text-secondary mt-2 animate-pulse">█</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-[200px] space-y-2 flex-shrink-0">
                {/* Test results */}
                <div className="bg-bg/60 pixel-border p-3">
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider block mb-2">Test Results</span>
                  <div className="space-y-1">
                    {["initialize", "claim_after_cliff", "claim_partial", "claim_full", "revoke_admin", "whitelist_check"].map((t, i) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-cast-green flex-shrink-0" />
                        <span className="font-mono text-[9px] text-text-secondary truncate">{t}</span>
                      </div>
                    ))}
                    <p className="font-mono text-[8px] text-text-muted mt-1">+ 7 more passed</p>
                  </div>
                </div>

                {/* Deploy status */}
                <div className="bg-bg/60 pixel-border p-3">
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider block mb-2">Deploy</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-text-secondary">Local</span>
                      <span className="font-mono text-[8px] text-cast-green">passed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-text-secondary">Devnet</span>
                      <span className="font-mono text-[8px] text-cast-green">live</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-text-secondary">Mainnet</span>
                      <span className="font-mono text-[8px] text-text-muted">ready</span>
                    </div>
                  </div>
                </div>

                {/* Marketplace */}
                <div className="bg-bg/60 pixel-border p-3">
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider block mb-2">Marketplace</span>
                  <p className="font-mono text-[9px] text-text-secondary">Publish as template</p>
                  <div className="mt-1.5 w-full px-2 py-1 pixel-border text-center font-mono text-[8px] text-forge-orange/50 border-forge-orange/20">
                    List on kazt.fun
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-wire-border to-transparent" />

      {/* Features grid */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className="pixel-border bg-bg-card/40 p-5 hover:border-forge-orange/20 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-[10px] uppercase tracking-wider text-text-primary">
                    {f.title}
                  </h3>
                  {f.beta && (
                    <span className="font-mono text-[7px] text-molten-gold px-1.5 py-0.5 border border-molten-gold/30 bg-molten-gold/10 uppercase tracking-wider">
                      beta
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-wire-border to-transparent" />

      {/* Download section */}
      <section className="relative py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-sm sm:text-base uppercase tracking-wider text-text-primary">
              Download
            </h2>
            <p className="mt-2 font-mono text-[10px] text-text-muted">
              v0.1.0-beta &middot; 4GB RAM &middot; 200MB disk
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="relative pixel-border bg-bg-card/60 p-5 group hover:border-forge-orange/30 transition-all duration-200"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-forge-orange/40 via-forge-orange to-forge-orange/40 opacity-40 group-hover:opacity-100 transition-opacity" />
                {/* Hover glow */}
                <div className="absolute inset-0 pointer-events-none bg-forge-orange/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Platform info */}
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="text-text-secondary group-hover:text-forge-orange transition-colors">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-[11px] uppercase tracking-wider text-text-primary">{p.name}</h3>
                    <p className="font-mono text-[9px] text-text-muted">{p.file} &middot; {p.size}</p>
                  </div>
                </div>

                {/* Download button — uses div so hover works, onClick blocked */}
                <div
                  role="button"
                  aria-disabled="true"
                  tabIndex={-1}
                  className="relative w-full px-4 py-2.5 pixel-border font-display uppercase text-[10px] tracking-wider bg-bg/40 flex items-center justify-center gap-2 text-text-muted transition-all duration-200 hover:text-forge-orange hover:border-forge-orange/30 hover:bg-forge-orange/[0.06] hover:shadow-[0_0_15px_rgba(249,115,22,0.08)] select-none"
                  onClick={(e) => e.preventDefault()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:translate-y-0.5">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                  </svg>
                  Download
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

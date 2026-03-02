"use client";

import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const RELEASE_BASE = "https://github.com/usekazt/kazt/releases/download/v0.1.0";

const PLATFORMS = [
  {
    name: "Windows",
    file: "Kazt-Forge-0.1.0.exe",
    href: `${RELEASE_BASE}/Kazt-Forge-0.1.0.exe`,
    size: "82.4 MB",
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
    file: "kazt-forge-0.1.0-x86_64.AppImage",
    href: `${RELEASE_BASE}/kazt-forge-0.1.0-x86_64.AppImage`,
    size: "76.1 MB",
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
    title: "Local Simulation Engine",
    desc: "Run high-performance ACE rule simulations locally. Test against millions of historical transactions without RPC limits.",
  },
  {
    title: "Direct Deployment",
    desc: "Deploy your execution layer directly to Solana mainnet from your desktop. Secure, fast, and fully integrated.",
  },
  {
    title: "Advanced Rule Forge",
    desc: "The full power of the visual node builder, optimized for desktop performance with hardware acceleration.",
  },
  {
    title: "Deflationary Sync",
    desc: "Every deployment through the desktop app routes 100% of fees to the $KAZT Buy & Burn smart contract.",
  },
  {
    title: "Template Marketplace",
    desc: "Browse, buy, and sell institutional-grade MEV protection templates directly from the desktop client.",
  },
  {
    title: "Jito BAM Integration",
    desc: "Native integration with Jito Block Engine. Configure TEE and encrypted mempool settings visually.",
  },
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
              Kazt Desktop Client
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-xl sm:text-2xl md:text-3xl text-text-primary uppercase leading-relaxed"
          >
            The Forge,<br />
            <span className="text-forge-orange" style={{ textShadow: "0 0 20px rgba(249,115,22,0.4)" }}>
              Unleashed.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 font-mono text-xs text-text-secondary tracking-wide max-w-xl mx-auto leading-relaxed"
          >
            Describe your Solana program in natural language. AI generates Anchor code,
            writes tests, runs them, and deploys. No Rust required.
          </motion.p>
        </div>
      </section>

      {/* ── App Preview: Desktop UI Mockup ── */}
      <section className="relative px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pixel-border bg-bg-card/80 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]"
          >
            {/* Window titlebar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-wire-border bg-bg-elevated">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-crack-red/80" />
                <div className="w-3 h-3 rounded-full bg-molten-gold/80" />
                <div className="w-3 h-3 rounded-full bg-cast-green/80" />
              </div>
              <span className="font-mono text-[10px] text-text-muted ml-2 tracking-widest">KAZT FORGE DESKTOP v0.1.0</span>
              <div className="ml-auto flex items-center gap-3">
                <span className="font-mono text-[9px] text-forge-orange">100% BURN ACTIVE</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-cast-green rounded-full animate-pulse" />
                  <span className="font-mono text-[9px] text-cast-green">MAINNET</span>
                </span>
              </div>
            </div>

            {/* Split layout: Sidebar + Canvas + Properties */}
            <div className="flex h-[500px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-wire-border bg-bg-elevated flex flex-col p-4">
                <div className="font-display text-[10px] text-text-muted uppercase tracking-wider mb-4">Rule Blocks</div>
                <div className="space-y-2">
                  {['Ordering', 'Batching', 'Matching', 'Priority', 'Filter'].map((type) => (
                    <div key={type} className="px-3 py-2 text-xs font-mono text-text-secondary border border-wire-border bg-bg/50 hover:border-forge-orange/50 transition-colors cursor-pointer">
                      + {type}
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <div className="font-display text-[10px] text-text-muted uppercase tracking-wider mb-2">Local Node</div>
                  <div className="px-3 py-2 text-[9px] font-mono text-cast-green border border-cast-green/30 bg-cast-green/10">
                    Syncing... Block 254,192,881
                  </div>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 relative bg-bg overflow-hidden">
                <div className="absolute inset-0" style={{
                  backgroundImage: "radial-gradient(circle, var(--color-wire-border) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />
                
                {/* Nodes & Lines Mockup */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 180 150 C 280 150, 280 250, 380 250" stroke="var(--color-forge-orange)" strokeWidth="2" fill="none" />
                  <path d="M 180 150 C 280 150, 280 80, 380 80" stroke="var(--color-crack-red)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>

                <div className="absolute top-[110px] left-[30px] w-48 bg-bg-card border border-crack-red/50 shadow-lg">
                  <div className="px-3 py-1.5 bg-crack-red/20 border-b border-crack-red/30 flex justify-between items-center">
                    <span className="font-display text-[10px] text-crack-red uppercase">Filter</span>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-text-primary font-mono mb-1">Sandwich Guard</div>
                    <div className="text-[9px] text-text-muted">Blocks known MEV bots</div>
                  </div>
                </div>

                <div className="absolute top-[210px] left-[380px] w-48 bg-bg-card border border-forge-orange/50 shadow-lg">
                  <div className="px-3 py-1.5 bg-forge-orange/20 border-b border-forge-orange/30 flex justify-between items-center">
                    <span className="font-display text-[10px] text-forge-orange uppercase">Ordering</span>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-text-primary font-mono mb-1">Price-Time Priority</div>
                    <div className="text-[9px] text-text-muted">Standard CLOB sorting</div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Simulation & Deploy */}
              <div className="w-64 border-l border-wire-border bg-bg-elevated flex flex-col">
                <div className="p-4 border-b border-wire-border">
                  <div className="font-display text-[10px] text-text-muted uppercase tracking-wider mb-3">Simulation Engine</div>
                  <div className="space-y-2 font-mono text-[9px]">
                    <div className="flex justify-between text-text-secondary"><span>Processed TXs:</span><span className="text-forge-orange">1,204,551</span></div>
                    <div className="flex justify-between text-text-secondary"><span>Filtered:</span><span className="text-crack-red">45,210</span></div>
                    <div className="flex justify-between text-text-secondary"><span>Passed:</span><span className="text-cast-green">1,159,341</span></div>
                  </div>
                  <button className="w-full mt-4 py-2 border border-forge-orange/50 text-forge-orange font-display text-[10px] uppercase tracking-wider hover:bg-forge-orange/10 transition-colors">
                    Run Local Sim
                  </button>
                </div>
                <div className="p-4 mt-auto border-t border-wire-border">
                  <div className="font-display text-[10px] text-text-muted uppercase tracking-wider mb-2">Deploy Layer</div>
                  <p className="text-[9px] text-text-muted font-mono mb-3">100% of deployment fees will be routed to $KAZT Buy & Burn.</p>
                  <button className="w-full py-2 bg-forge-orange text-bg font-display text-[10px] uppercase tracking-wider hover:bg-forge-orange-light transition-colors">
                    Deploy & Burn
                  </button>
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
              Desktop Exclusives
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
              Download Client
            </h2>
            <p className="mt-2 font-mono text-[10px] text-text-muted">
              v0.1.0-beta &middot; 8GB RAM &middot; 500MB disk recommended for local simulation
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

                {/* Download button — disabled until public release */}
                <div
                  className="relative w-full px-4 py-3 pixel-border font-display uppercase text-[10px] tracking-wider bg-bg/40 flex items-center justify-center gap-2 text-text-muted/40 cursor-not-allowed select-none"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                  </svg>
                  Coming Soon
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

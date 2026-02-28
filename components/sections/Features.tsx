"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useJuice } from "@/hooks/useJuice";

const FEATURES = [
  { icon: "/images/icons/anvil-hammer.png", title: "Visual Rule Builder", desc: "Drag-and-drop ACE rule blocks. Ordering, batching, matching, priority, filters — no Rust required.", size: "large", accent: "forge-orange" },
  { icon: "/images/icons/fire-simulate.png", title: "Rule Simulator", desc: "Test rules against sample transactions. Catch conflicts before they hit mainnet.", size: "small", accent: "crack-red" },
  { icon: "/images/icons/chain-deploy.png", title: "One-Click Deploy", desc: "Export as Anchor IDL or JSON. Deploy to Solana directly from the forge.", size: "small", accent: "cast-green" },
  { icon: "/images/icons/shield-bam.png", title: "Jito BAM Integration", desc: "Toggle TEE, encrypted mempool, and sequencing settings visually.", size: "small", accent: "pixel-blue" },
  { icon: "/images/icons/chest-marketplace.png", title: "Template Marketplace", desc: "Browse, buy, and sell verified rule sets. Community-tested protection patterns.", size: "small", accent: "pixel-purple" },
  { icon: "/images/icons/magnify-conflict.png", title: "Conflict Detection", desc: "Dependency graph analysis catches circular references and conflicting rules before deploy.", size: "large", accent: "molten-gold" },
];

/* Animated pixel rain */
function PixelRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${8 + Math.random() * 84}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${4 + Math.random() * 4}s`,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-0.5"
          style={{
            left: d.left,
            top: "-20px",
            height: "12px",
            background: "linear-gradient(to bottom, transparent, var(--color-forge-orange))",
            opacity: d.opacity,
            animation: `pixel-rain ${d.duration} ${d.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function Features() {
  const { triggerEmbers } = useJuice();

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-20">
        <Image src="/images/features-section.png" alt="" fill className="object-cover pixel-render" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/40 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80" />
      </div>

      {/* Pixel grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
        backgroundImage: `
          linear-gradient(var(--color-forge-orange) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-forge-orange) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <PixelRain />

      {/* Corner pixel decorations */}
      <div className="absolute top-6 left-6 flex flex-col gap-0.5 opacity-30 pointer-events-none">
        <div className="flex gap-0.5">
          <div className="w-2 h-2 bg-forge-orange" />
          <div className="w-2 h-2 bg-forge-orange/50" />
          <div className="w-2 h-2 bg-forge-orange/25" />
        </div>
        <div className="flex gap-0.5"><div className="w-2 h-2 bg-forge-orange/50" /></div>
      </div>
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-0.5 opacity-30 pointer-events-none">
        <div className="flex gap-0.5">
          <div className="w-2 h-2 bg-forge-orange/25" />
          <div className="w-2 h-2 bg-forge-orange/50" />
          <div className="w-2 h-2 bg-forge-orange" />
        </div>
        <div className="flex justify-end"><div className="w-2 h-2 bg-forge-orange/50" /></div>
      </div>

      {/* Glows */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-forge-orange/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-pixel-purple/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block font-display text-[10px] tracking-[0.3em] text-forge-orange uppercase pixel-border-orange px-4 py-1.5 bg-forge-orange/10 mb-4">
            Features
          </span>
          <h2 className="font-display text-lg sm:text-xl md:text-2xl text-text-primary uppercase leading-relaxed">
            Everything you need to<br />
            <span className="text-forge-orange" style={{ textShadow: "0 0 16px rgba(249,115,22,0.3)" }}>forge on-chain rules.</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.08 * i }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                triggerEmbers(rect.left + rect.width / 2, rect.top, 5);
              }}
              className={`pixel-border bg-bg-card/70 backdrop-blur-sm p-6 group
                hover:bg-bg-card hover:border-forge-orange/30
                transition-all duration-200 relative overflow-hidden ${
                f.size === "large" ? "sm:col-span-2" : ""
              }`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 w-0 group-hover:w-full h-0.5 bg-${f.accent} transition-all duration-300`} />

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-forge-orange/[0.03] to-transparent" />

              <div className="relative flex items-start gap-4">
                <div
                  className="relative w-8 h-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ animation: `pixel-float 3s ${i * 0.3}s ease-in-out infinite` }}
                >
                  <Image src={f.icon} alt="" fill className="object-contain pixel-render" sizes="32px" />
                </div>
                <div>
                  <h3 className="font-display text-[10px] sm:text-xs text-text-primary uppercase tracking-wider mb-2 group-hover:text-forge-orange transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edge lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forge-orange/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forge-orange/20 to-transparent" />
    </section>
  );
}

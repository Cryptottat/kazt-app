"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useJuice } from "@/hooks/useJuice";
import { features } from "@/lib/features";

export default function CTA() {
  const { triggerHit } = useJuice();

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Hero-bg mirrored — book-ending the page */}
      <div className="absolute inset-0 opacity-15">
        <Image src="/images/hero-bg.png" alt="" fill className="object-cover pixel-render scale-x-[-1]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/50 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/80" />
      </div>

      {/* Cross-hatch overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 24px, var(--color-forge-orange) 24px, var(--color-forge-orange) 25px),
          repeating-linear-gradient(90deg, transparent, transparent 24px, var(--color-forge-orange) 24px, var(--color-forge-orange) 25px)
        `,
      }} />

      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-forge-orange/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-molten-gold/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="pixel-border bg-bg-card/50 backdrop-blur-sm p-8 sm:p-12 relative overflow-hidden group hover:border-forge-orange/20 transition-colors duration-300">
          {/* Card inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-forge-orange/[0.04] via-transparent to-molten-gold/[0.04]" />
          {/* Hover reveal glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-forge-orange/[0.03] to-transparent" />

          <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Character — bobbing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40"
                style={{ animation: "npc-bob 3s ease-in-out infinite" }}
              >
                <Image
                  src="/images/character.png"
                  alt="Blacksmith Kazt"
                  fill
                  className="object-contain pixel-render"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-forge-orange/10 rounded-full blur-[30px]" />
              </div>
            </motion.div>

            {/* Text + buttons */}
            <div className="text-center md:text-left flex-1">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-lg sm:text-xl md:text-2xl text-text-primary uppercase leading-relaxed"
              >
                The workshop is open.<br />
                <span className="text-forge-orange" style={{ textShadow: "0 0 20px rgba(249,115,22,0.4)" }}>Start crafting.</span>
              </motion.h2>

              {/* Dialogue-style subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3"
              >
                <p className="text-sm text-text-secondary font-mono">
                  &quot;The toll booth for Solana's liquidity. Build once, burn forever.&quot;
                </p>
                <p className="text-[9px] text-text-muted mt-1 font-display tracking-wider uppercase">— Blacksmith Kazt</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
              >
                {features.forge ? (
                  <Link
                    href="/forge"
                    onMouseDown={(e) => triggerHit(e)}
                    className="juice-btn px-8 py-3 bg-forge-orange text-bg font-display uppercase text-xs tracking-wider hover:bg-forge-orange-light transition-colors active:scale-95"
                  >
                    Launch Forge
                  </Link>
                ) : (
                  <span
                    onMouseDown={(e) => triggerHit(e)}
                    className="juice-btn-secondary px-8 py-3 pixel-border text-text-muted font-display uppercase text-xs tracking-wider bg-bg/40"
                  >
                    Coming Soon
                  </span>
                )}
                <a
                  href="https://x.com/usekazt"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseDown={(e) => triggerHit(e)}
                  className="juice-btn-secondary px-8 py-3 pixel-border text-text-primary font-display uppercase text-xs tracking-wider hover:border-forge-orange hover:text-forge-orange transition-colors bg-bg/40"
                >
                  Follow @kazt
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Pixel line decoration */}
        <div className="mt-8 flex justify-center gap-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-forge-orange"
              style={{
                opacity: Math.abs(7 - i) === 0 ? 0.9 : 0.06 + (7 - Math.abs(7 - i)) * 0.08,
                animation: `pixel-pulse 2s ${i * 0.1}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forge-orange/20 to-transparent" />
    </section>
  );
}

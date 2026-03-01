"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useJuice } from "@/hooks/useJuice";
import { features } from "@/lib/features";

const PROJECT_CA = process.env.NEXT_PUBLIC_PROJECT_CA ?? "";
const raydiumHref = PROJECT_CA
  ? `https://raydium.io/swap/?inputMint=sol&outputMint=${PROJECT_CA}`
  : "#";

interface Tier {
  name: string;
  range: string;
  color: string;
  borderColor: string;
  features: string[];
  highlight?: boolean;
  icon: string;
}

const TIERS: Tier[] = [
  { name: "Free", range: "0 $KAZT", color: "text-text-muted", borderColor: "border-wire-border", icon: "/images/icons/tier-basic.png", features: ["3 rule blocks max", "Basic ordering rules", "JSON export only", "Community templates"] },
  { name: "Basic", range: "100,000 $KAZT", color: "text-text-secondary", borderColor: "border-iron-gray-light", icon: "/images/icons/tier-basic.png", features: ["10 rule blocks max", "All rule types", "JSON + Anchor export", "Simulation: 50 TX", "Conflict detection"] },
  { name: "Pro", range: "1,000,000 $KAZT", color: "text-molten-gold", borderColor: "border-molten-gold/50", highlight: true, icon: "/images/icons/tier-pro.png", features: ["Unlimited blocks", "All rule types", "All export formats", "Simulation: 500 TX", "Advanced conflict analysis", "Template marketplace", "Priority support"] },
  { name: "Elite", range: "5,000,000 $KAZT", color: "text-forge-orange", borderColor: "border-forge-orange/50", icon: "/images/icons/tier-elite.png", features: ["Everything in Pro", "Custom rule plugins", "Simulation: 5,000 TX", "Direct deploy to Solana", "Rule versioning", "Team workspaces", "Dedicated support"] },
  { name: "Whale", range: "25,000,000 $KAZT", color: "text-crack-red", borderColor: "border-crack-red/30", icon: "/images/icons/tier-whale.png", features: ["Everything in Elite", "White-label forge", "Unlimited simulations", "Custom integrations", "Governance voting power", "50% Fee Discount", "Direct team access"] },
];

/* Floating gold sparkles */
function GoldSparkles() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${2 + Math.random() * 3}s`,
        size: Math.random() > 0.5 ? 2 : 1.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: "var(--color-molten-gold)",
            animation: `pixel-pulse ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function TokenUtility() {
  const [activeTier, setActiveTier] = useState(2);
  const { triggerHit } = useJuice();

  if (!features.showTokenInfo) return null;

  return (
    <section id="token" className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Golden gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-molten-gold/[0.05] to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, var(--color-forge-orange) 3px, var(--color-forge-orange) 4px)",
      }} />

      {/* Logo watermark */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden lg:block">
        <div className="relative w-[300px] h-[300px]">
          <Image src="/images/logo.png" alt="" fill className="object-contain pixel-render" sizes="300px" />
        </div>
      </div>

      <GoldSparkles />

      {/* Glows */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-forge-orange/8 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-molten-gold/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-14">
          <div className="flex items-start gap-6">
            <div className="hidden sm:block w-1 h-24 bg-gradient-to-b from-forge-orange via-molten-gold/50 to-transparent flex-shrink-0 mt-2" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block font-display text-[10px] tracking-[0.3em] text-forge-orange uppercase pixel-border-orange px-4 py-1.5 bg-forge-orange/10 mb-4">
                $KAZT Tiers
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl text-text-primary uppercase leading-relaxed">
                More tokens, <span className="text-forge-orange" style={{ textShadow: "0 0 16px rgba(249,115,22,0.3)" }}>more power.</span>
              </h2>
              <p className="mt-2 text-sm text-text-secondary">Hold $KAZT to unlock advanced forge capabilities.</p>
            </motion.div>
          </div>

          {/* Deflationary Highlight Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-auto pixel-border-orange bg-forge-orange/5 p-5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-forge-orange/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-forge-orange/20 rounded-full flex items-center justify-center border border-forge-orange/30">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <h3 className="font-display text-sm text-forge-orange uppercase tracking-wider mb-1">
                  100% Buy & Burn
                </h3>
                <p className="text-xs text-text-secondary max-w-[200px] leading-relaxed">
                  All protocol revenue from template sales and deployments is used to buy and burn $KAZT.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TIERS.map((tier, index) => (
            <motion.button
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.08 * index }}
              onClick={(e) => {
                triggerHit(e);
                setActiveTier(index);
              }}
              className={`relative text-left pixel-border bg-bg-card/60 p-5 transition-all duration-200 group ${
                activeTier === index
                  ? `${tier.borderColor} shadow-[0_0_30px_rgba(249,115,22,0.15)] bg-bg-card/90`
                  : "hover:border-wire-border-hover hover:bg-bg-card/80"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-molten-gold text-bg font-display text-[8px] uppercase tracking-wider">
                  Popular
                </div>
              )}

              {/* Active top bar */}
              {activeTier === index && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-forge-orange" />
              )}

              {/* Tier icon */}
              <div className="relative w-8 h-8 mb-2" style={{ animation: activeTier === index ? `pixel-float 2s ease-in-out infinite` : undefined }}>
                <Image src={tier.icon} alt="" fill className="object-contain pixel-render" sizes="32px" />
              </div>

              <h3 className={`font-display text-[10px] uppercase tracking-wider ${tier.color}`}>{tier.name}</h3>
              <p className="mt-1 text-text-muted text-[10px] font-mono">{tier.range}</p>
              <div className={`mt-3 mb-3 h-px ${activeTier === index ? "bg-forge-orange/30" : "bg-wire-border"}`} />
              <ul className="space-y-1.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-1.5 text-[10px] text-text-secondary">
                    <span className={`mt-0.5 w-1.5 h-1.5 flex-shrink-0 transition-colors ${activeTier === index ? "bg-forge-orange" : "bg-text-muted"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        {/* Buy CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href={raydiumHref}
            target={PROJECT_CA ? "_blank" : undefined}
            rel={PROJECT_CA ? "noopener noreferrer" : undefined}
            onMouseDown={(e) => triggerHit(e)}
            className="juice-btn inline-block px-8 py-3 bg-forge-orange text-bg font-display uppercase text-xs tracking-wider hover:bg-forge-orange-light transition-colors"
          >
            Get $KAZT on Raydium
          </a>
        </motion.div>
      </div>

      {/* Edge lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forge-orange/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forge-orange/20 to-transparent" />
    </section>
  );
}

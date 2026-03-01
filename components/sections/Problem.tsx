"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const STATS = [
  { value: "$5-10M", label: "Daily MEV losses on Solana DEXs", color: "text-crack-red", icon: "/images/icons/skull-mev.png" },
  { value: "Billions", label: "Volume to be routed through Kazt", color: "text-warning", icon: "/images/icons/shield-broken.png" },
  { value: "100%", label: "Protocol fees burned", color: "text-forge-orange", icon: "/images/icons/explosion.png" },
  { value: "0 Lines", label: "Of Rust code required", color: "text-text-secondary", icon: "/images/icons/hourglass.png" },
];

/* Broken pixel debris that scatter from mouse */
function BrokenDebris() {
  const debrisRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [debris] = useState(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      baseX: 0,
      baseY: 0,
      size: 3 + Math.random() * 6,
      rotation: Math.random() * 360,
      color: Math.random() > 0.5 ? "#EF4444" : Math.random() > 0.5 ? "#F97316" : "#6B7280",
      opacity: 0.2 + Math.random() * 0.4,
    }))
  );

  useEffect(() => {
    // Set base positions after mount
    debris.forEach((d) => {
      d.baseX = d.x;
      d.baseY = d.y;
    });
  }, [debris]);

  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!debrisRef.current) return;
      const rect = debrisRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      debris.forEach((d) => {
        const dx = d.baseX - mx;
        const dy = d.baseY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 20;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          d.x += (dx / dist) * force * 2;
          d.y += (dy / dist) * force * 2;
        }

        // Spring back to base
        d.x += (d.baseX - d.x) * 0.05;
        d.y += (d.baseY - d.y) * 0.05;
        d.rotation += 0.2;
      });

      if (debrisRef.current) {
        const children = debrisRef.current.children;
        debris.forEach((d, i) => {
          if (children[i]) {
            (children[i] as HTMLElement).style.transform =
              `translate(${d.x}%, ${d.y}%) rotate(${d.rotation}deg)`;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    const el = debrisRef.current;
    el?.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      el?.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [debris]);

  return (
    <div ref={debrisRef} className="absolute inset-0 pointer-events-auto overflow-hidden">
      {debris.map((d) => (
        <div
          key={d.id}
          className="absolute will-change-transform"
          style={{
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
            opacity: d.opacity,
            transform: `translate(${d.x}%, ${d.y}%)`,
          }}
        />
      ))}
    </div>
  );
}

export default function Problem() {
  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Dark red gradient — "dying forge" feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-crack-red/12 via-bg to-iron-gray-dark/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/50" />

      {/* Visible diagonal cracks */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, var(--color-crack-red) 8px, var(--color-crack-red) 9px)",
      }} />

      {/* Broken debris — interactive! */}
      <BrokenDebris />

      {/* Large broken shield icon watermark */}
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2 pointer-events-none select-none hidden lg:block opacity-[0.06]">
        <div className="relative w-[220px] h-[220px]">
          <Image src="/images/icons/shield-watermark.png" alt="" fill className="object-contain pixel-render" sizes="220px" />
        </div>
      </div>

      {/* Red glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-crack-red/12 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-forge-orange/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block font-display text-[10px] tracking-[0.3em] text-crack-red uppercase pixel-border px-4 py-1.5 bg-crack-red/10 mb-6">
              The Problem
            </span>

            <h2 className="font-display text-lg sm:text-xl md:text-2xl text-text-primary uppercase leading-relaxed mb-4">
              Your forge is<br />
              <span className="text-crack-red" style={{ textShadow: "0 0 20px rgba(239,68,68,0.4)" }}>
                wide open to raiders.
              </span>
            </h2>

            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              MEV bots extract millions daily. Protocols bleed, and users pay the hidden tax. ACE rules can stop them —
              but writing them takes a week of Rust coding. We fix this at the ecosystem level.
            </p>

            {/* JRPG-style dialogue box warning */}
            <div className="dialogue-box p-4 font-mono text-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative w-5 h-5 flex-shrink-0">
                  <Image src="/images/icons/warning-alert.png" alt="" fill className="object-contain pixel-render" sizes="20px" />
                </div>
                <span className="font-display text-[9px] tracking-wider text-crack-red uppercase">System Alert</span>
              </div>
              <p className="text-crack-red mb-1">No ACE rules detected.</p>
              <p className="text-crack-red mb-1">Protocol is MEV-vulnerable.</p>
              <p className="text-cast-green mt-2">→ Forge protection rules with Kazt.</p>
              <span className="inline-block w-2 h-3 bg-forge-orange ml-1" style={{ animation: "cursor-blink 1s step-end infinite" }} />
            </div>
          </motion.div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.12 * i }}
                className="pixel-border bg-bg-card/70 p-5 text-center group hover:bg-bg-card transition-colors relative overflow-hidden"
              >
                {/* Colored top accent */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                  stat.color === "text-crack-red" ? "bg-crack-red" :
                  stat.color === "text-warning" ? "bg-warning" :
                  stat.color === "text-forge-orange" ? "bg-forge-orange" : "bg-text-secondary"
                }`} />

                <div className="relative w-10 h-10 mx-auto mb-2" style={{ animation: `pixel-float 3s ${i * 0.4}s ease-in-out infinite` }}>
                  <Image src={stat.icon} alt="" fill className="object-contain pixel-render" sizes="40px" />
                </div>
                <div className={`font-display text-sm sm:text-base ${stat.color}`} style={{
                  textShadow: stat.color === "text-crack-red" ? "0 0 12px rgba(239,68,68,0.4)" : undefined,
                }}>
                  {stat.value}
                </div>
                <div className="mt-2 text-[9px] sm:text-[10px] text-text-muted leading-relaxed">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crack-red/30 to-transparent" />
    </section>
  );
}

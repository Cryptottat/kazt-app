"use client";

import { useMemo, useRef, useEffect, useState, useCallback, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useJuice } from "@/hooks/useJuice";
import { features } from "@/lib/features";

const AnvilScene = lazy(() => import("@/components/three/AnvilScene"));

const PROJECT_CA = process.env.NEXT_PUBLIC_PROJECT_CA ?? "";

/* ── Typewriter letter animation ─────────────────── */
const charVariant = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          variants={charVariant}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block"
          style={ch === " " ? { width: "0.35em" } : undefined}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Pixel Embers (CSS only fallback) ────────────── */
function PixelEmbers() {
  const embers = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${1.5 + Math.random() * 2}s`,
        size: Math.random() > 0.5 ? "w-1 h-1" : "w-0.5 h-0.5",
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {embers.map((e) => (
        <div
          key={e.id}
          className={`absolute ${e.size} bg-forge-orange`}
          style={{
            left: e.left,
            bottom: "20%",
            animation: `ember-rise ${e.duration} ${e.delay} ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Component ───────────────────────────────────── */

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { triggerHit, triggerEmbers } = useJuice();
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [show3D, setShow3D] = useState(false);

  // Lazy load 3D on desktop
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => setShow3D(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Parallax mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transform mouse position to parallax offsets
  const bgX = useTransform(springX, [-1, 1], [15, -15]);
  const bgY = useTransform(springY, [-1, 1], [10, -10]);
  const fgX = useTransform(springX, [-1, 1], [-8, 8]);
  const fgY = useTransform(springY, [-1, 1], [-5, 5]);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);

      // Mouse proximity → text glow intensity
      if (headingRef.current) {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const a = Math.max(0.2, Math.min(0.85, 1 - dist * 2.5));
        const glowEl = headingRef.current.querySelector<HTMLElement>("[data-glow]");
        if (glowEl) {
          glowEl.style.textShadow = `0 0 ${10 + a * 30}px rgba(249,115,22,${a}), 0 0 ${20 + a * 50}px rgba(249,115,22,${a * 0.4})`;
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  // Anvil hit handler
  const handleAnvilHit = useCallback(() => {
    triggerHit({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
  }, [triggerHit]);

  // CTA button handler
  const handleCTAClick = useCallback(
    (e: React.MouseEvent) => {
      triggerHit(e);
    },
    [triggerHit]
  );

  const seq = {
    badge: 0.3,
    line1: 0.6,
    line2: 1.8,
    subtitle: 2.8,
    cta: 3.2,
    scroll: 3.8,
  };

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Parallax pixel art background */}
      <motion.div
        className="absolute inset-[-30px]"
        style={!isMobile ? { x: bgX, y: bgY } : undefined}
      >
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover pixel-render opacity-60"
          sizes="110vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-transparent" />
      </motion.div>

      {/* 3D Anvil (desktop only) — sits in bottom 50%, not overlapping text */}
      {show3D && !isMobile && (
        <div className="absolute left-0 right-0 top-[50%] bottom-0 z-[1]">
          <AnvilScene onAnvilHit={handleAnvilHit} />
        </div>
      )}

      {/* Mobile: CSS embers fallback */}
      {isMobile && <PixelEmbers />}

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none z-[2]" />

      {/* Corner bracket decorations (desktop only) */}
      {!isMobile && (
        <>
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-forge-orange/10 z-[3] pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-forge-orange/10 z-[3] pointer-events-none" />
        </>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center"
        style={!isMobile ? { x: fgX, y: fgY } : undefined}
      >
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: seq.badge }}
          className="mb-8 flex items-center gap-3 pixel-border px-4 py-2 bg-bg/60 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-cast-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-cast-green" />
          </span>
          <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
            v0.1 // FORGE PROTOCOL
          </span>
        </motion.div>

        {/* Main heading */}
        <h1 ref={headingRef} className="font-display uppercase">
          <motion.span
            className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.03, delayChildren: seq.line1 }}
          >
            <SplitText text="Pour your rules." />
          </motion.span>

          <motion.span
            data-glow
            className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-forge-orange mt-2 leading-relaxed"
            style={{ textShadow: "0 0 20px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.15)" }}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.03, delayChildren: seq.line2 }}
          >
            <SplitText text="Set them in chain." />
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: seq.subtitle }}
          className="mt-8 flex items-center gap-4"
        >
          <span className="hidden sm:block w-8 h-0.5 bg-forge-orange/30" />
          <p className="font-mono text-[10px] sm:text-xs text-text-secondary tracking-[0.2em] uppercase">
            The Deflationary Execution Layer for Solana DeFi
          </p>
          <span className="hidden sm:block w-8 h-0.5 bg-forge-orange/30" />
        </motion.div>

        {/* CTA Buttons with JUICE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: seq.cta }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          {features.forge ? (
            <Link
              href="/forge"
              onClick={handleCTAClick}
              className="juice-btn px-8 py-3 bg-forge-orange text-bg font-display uppercase text-xs tracking-[0.2em] hover:bg-forge-orange-light transition-colors active:scale-95"
            >
              Launch Forge
            </Link>
          ) : (
            <span
              onClick={handleCTAClick}
              className="juice-btn-secondary px-8 py-3 pixel-border text-text-muted font-display uppercase text-xs tracking-wider bg-bg/40"
            >
              Coming Soon
            </span>
          )}
          {features.showTokenInfo && (
            <a
              href="#token"
              onClick={handleCTAClick}
              className="juice-btn-secondary px-8 py-3 pixel-border text-text-primary font-display uppercase text-xs tracking-[0.2em] hover:border-forge-orange hover:text-forge-orange transition-colors bg-bg/40 backdrop-blur-sm"
            >
              Get $KAZT
            </a>
          )}
        </motion.div>

        {/* CA Address */}
        {PROJECT_CA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: seq.cta + 0.3 }}
            className="mt-6 flex items-center gap-2 pixel-border px-4 py-2 bg-bg/60 backdrop-blur-sm"
          >
            <span className="font-mono text-[10px] text-text-muted tracking-wider">CA:</span>
            <span className="font-mono text-[10px] text-forge-orange tracking-wider select-all">{PROJECT_CA}</span>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: seq.scroll }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[8px] text-text-muted tracking-[0.3em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-3 h-3 border-b-2 border-r-2 border-text-muted rotate-45"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

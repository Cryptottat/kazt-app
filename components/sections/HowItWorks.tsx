"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useJuice } from "@/hooks/useJuice";

const STEPS = [
  {
    number: "01",
    title: "Design",
    icon: "/images/icons/blueprint-design.png",
    speaker: "Blacksmith Kazt",
    dialogue: "First, lay out your rule blocks on the forge canvas. Drag and drop ordering, batching, matching, priority, and filter rules. No Rust required — just craft what you need.",
    color: "molten-gold",
  },
  {
    number: "02",
    title: "Simulate",
    icon: "/images/icons/fire-simulate.png",
    speaker: "Blacksmith Kazt",
    dialogue: "Now test your creation in the fire. Run transaction simulations against your rules. I'll help you spot conflicts and edge cases before you commit to chain.",
    color: "forge-orange",
  },
  {
    number: "03",
    title: "Deploy & Burn",
    icon: "/images/icons/chain-deploy.png",
    speaker: "Blacksmith Kazt",
    dialogue: "Your rules are ready. Export as Anchor IDL or JSON, then deploy directly to Solana. Every deployment and template sale burns $KAZT. The flywheel turns.",
    color: "cast-green",
  },
];

/* Typewriter effect hook */
function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current <= text.length) {
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  // Skip to end
  const skipToEnd = useCallback(() => {
    setDisplayed(text);
    setIsDone(true);
  }, [text]);

  return { displayed, isDone, skipToEnd };
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];
  const { displayed, isDone, skipToEnd } = useTypewriter(step.dialogue, 25);
  const { triggerHit } = useJuice();

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      if (!isDone) {
        skipToEnd();
        return;
      }
      triggerHit(e);
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    },
    [isDone, skipToEnd, triggerHit]
  );

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      triggerHit(e);
      setActiveStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
    },
    [triggerHit]
  );

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Warm workshop gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-molten-gold/[0.05] to-bg" />

      {/* Dot grid — visible */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.1]" style={{
        backgroundImage: "radial-gradient(circle, var(--color-molten-gold) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-molten-gold/8 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block font-display text-[10px] tracking-[0.3em] text-molten-gold uppercase pixel-border px-4 py-1.5 bg-molten-gold/10 mb-4">
            How It Works
          </span>
          <h2 className="font-display text-lg sm:text-xl md:text-2xl text-text-primary uppercase leading-relaxed">
            Three steps to on-chain.
          </h2>
          <p className="mt-2 text-sm text-text-secondary">The blacksmith will guide you.</p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s.number}
              onClick={(e) => { triggerHit(e); setActiveStep(i); }}
              className={`juice-btn-secondary px-4 py-2 pixel-border font-display text-[9px] uppercase tracking-wider transition-all ${
                i === activeStep
                  ? `bg-${s.color}/20 border-${s.color} text-${s.color}`
                  : "bg-bg-card/50 text-text-muted hover:text-text-secondary"
              }`}
            >
              {s.number} {s.title}
            </button>
          ))}
        </div>

        {/* Main dialogue area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-end gap-6 md:gap-8"
        >
          {/* NPC Character — bobbing */}
          <div className="flex-shrink-0 self-center md:self-end">
            <div
              className="relative w-24 h-24 sm:w-32 sm:h-32"
              style={{ animation: "npc-bob 3s ease-in-out infinite" }}
            >
              <Image
                src="/images/character.png"
                alt="Blacksmith Kazt"
                fill
                className="object-contain pixel-render"
                sizes="128px"
              />
            </div>
          </div>

          {/* Dialogue Box */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="dialogue-box p-5 sm:p-6"
              >
                {/* Speaker name tag */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${step.color}/20 mb-3`}>
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Image src={step.icon} alt="" fill className="object-contain pixel-render" sizes="16px" />
                  </div>
                  <span className={`font-display text-[9px] tracking-wider text-${step.color} uppercase`}>
                    {step.speaker}
                  </span>
                </div>

                {/* Step title */}
                <h3 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-3">
                  Step {step.number}: {step.title}
                </h3>

                {/* Typed dialogue text */}
                <p className="text-sm text-text-secondary leading-relaxed min-h-[60px] font-mono">
                  {displayed}
                  {!isDone && (
                    <span className="inline-block w-2 h-4 bg-forge-orange ml-0.5 align-middle"
                      style={{ animation: "dialogue-cursor-blink 0.6s step-end infinite" }} />
                  )}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-wire-border">
                  <button
                    onClick={handlePrev}
                    className="juice-btn-secondary px-3 py-1.5 pixel-border font-display text-[9px] text-text-muted uppercase tracking-wider hover:text-forge-orange hover:border-forge-orange transition-colors"
                  >
                    ◀ Prev
                  </button>

                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <div key={i} className={`w-2 h-2 transition-colors ${
                        i === activeStep ? "bg-forge-orange" :
                        i < activeStep ? "bg-forge-orange/40" : "bg-wire-border"
                      }`} />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="juice-btn-secondary px-3 py-1.5 pixel-border font-display text-[9px] text-forge-orange uppercase tracking-wider hover:bg-forge-orange/10 transition-colors"
                  >
                    {isDone ? (activeStep < STEPS.length - 1 ? "Next ▶" : "Restart ▶") : "Skip ▶▶"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Edge lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-molten-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-molten-gold/20 to-transparent" />
    </section>
  );
}

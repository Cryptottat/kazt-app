"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ForgeScene = dynamic(() => import("@/components/three/ForgeScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* 3D Background or mobile fallback */}
      {isMobile ? (
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-[#1a0f05] to-bg">
          {/* Static radial glow for mobile */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-forge-orange/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] w-[200px] h-[200px] bg-molten-gold/15 rounded-full blur-[80px]" />
          {/* Ember-like dots */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-forge-orange rounded-full animate-pulse"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  opacity: 0.3 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <ForgeScene />
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-transparent pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Main heading */}
        <h1 className="font-display uppercase tracking-wider">
          <span
            className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text-primary"
            style={{
              textShadow:
                "0 0 40px rgba(249,115,22,0.4), 0 0 80px rgba(249,115,22,0.2), 0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            Pour your rules.
          </span>
          <span
            className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-forge-orange mt-2"
            style={{
              textShadow:
                "0 0 30px rgba(249,115,22,0.5), 0 0 60px rgba(245,158,11,0.3), 0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            Set them in chain.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 text-base sm:text-lg md:text-xl text-text-secondary max-w-xl"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
        >
          The first visual ACE rule builder on Solana.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/forge"
            className="cursor-hammer px-8 py-3.5 bg-forge-orange text-white font-display uppercase tracking-wider text-sm rounded hover:bg-forge-orange-light transition-all duration-200 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
          >
            Launch Forge
          </Link>
          <a
            href="#token"
            className="cursor-hammer px-8 py-3.5 border border-wire-border-hover text-text-primary font-display uppercase tracking-wider text-sm rounded hover:border-forge-orange hover:text-forge-orange transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
          >
            Buy $KAZT
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-text-muted text-xs uppercase tracking-widest">
            Scroll
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-text-muted"
          >
            <path d="M8 4v16M2 14l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}

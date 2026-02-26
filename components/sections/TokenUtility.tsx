"use client";

import { useState } from "react";
import { features } from "@/lib/features";

// 프로젝트 CA가 존재하면 실제 DEX 링크 생성
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
}

const TIERS: Tier[] = [
  {
    name: "Free",
    range: "0 $KAZT",
    color: "text-text-muted",
    borderColor: "border-wire-border",
    features: [
      "3 rule blocks max",
      "Basic ordering rules",
      "JSON export only",
      "Community templates",
    ],
  },
  {
    name: "Basic",
    range: "1,000 $KAZT",
    color: "text-text-secondary",
    borderColor: "border-iron-gray-light",
    features: [
      "10 rule blocks max",
      "All rule types",
      "JSON + Anchor export",
      "Simulation: 50 TX",
      "Conflict detection",
    ],
  },
  {
    name: "Pro",
    range: "10,000 $KAZT",
    color: "text-molten-gold",
    borderColor: "border-molten-gold/50",
    highlight: true,
    features: [
      "Unlimited blocks",
      "All rule types",
      "All export formats",
      "Simulation: 500 TX",
      "Advanced conflict analysis",
      "Template marketplace",
      "Priority support",
    ],
  },
  {
    name: "Elite",
    range: "50,000 $KAZT",
    color: "text-forge-orange",
    borderColor: "border-forge-orange/50",
    features: [
      "Everything in Pro",
      "Custom rule plugins",
      "Simulation: 5,000 TX",
      "Direct deploy to Solana",
      "Rule versioning",
      "Team workspaces",
      "Dedicated support",
    ],
  },
  {
    name: "Whale",
    range: "250,000 $KAZT",
    color: "text-crack-red",
    borderColor: "border-crack-red/30",
    features: [
      "Everything in Elite",
      "White-label forge",
      "Unlimited simulations",
      "Custom integrations",
      "Governance voting power",
      "Revenue sharing",
      "Direct team access",
    ],
  },
];

export default function TokenUtility() {
  const [activeTier, setActiveTier] = useState(2); // Pro highlighted by default

  // Phase 1: 토큰 정보 비공개 상태면 렌더링하지 않음
  if (!features.showTokenInfo) return null;

  return (
    <section id="token" className="relative py-24 sm:py-32 px-4 overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-forge-orange/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary">
            $KAZT Tiers
          </h2>
          <div className="mt-4 w-20 h-[2px] bg-forge-orange mx-auto" />
          <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto">
            Hold $KAZT to unlock advanced forge capabilities. More tokens, more
            power.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TIERS.map((tier, index) => (
            <button
              key={tier.name}
              onClick={() => setActiveTier(index)}
              className={`relative text-left bg-bg-card border rounded-lg p-6 transition-all duration-300 cursor-hammer ${
                activeTier === index
                  ? `${tier.borderColor} shadow-[0_0_25px_rgba(249,115,22,0.12)]`
                  : "border-wire-border hover:border-wire-border-hover"
              }`}
            >
              {/* Highlight badge */}
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-molten-gold text-bg text-xs font-bold uppercase tracking-wider rounded">
                  Popular
                </div>
              )}

              {/* Tier name */}
              <h3
                className={`font-display text-lg font-bold uppercase tracking-wider ${tier.color}`}
              >
                {tier.name}
              </h3>

              {/* Token requirement */}
              <p className="mt-1 text-text-muted text-xs font-mono">
                {tier.range}
              </p>

              {/* Divider */}
              <div
                className={`mt-4 mb-4 h-[1px] ${
                  activeTier === index ? "bg-forge-orange/30" : "bg-wire-border"
                }`}
              />

              {/* Features */}
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-text-secondary"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className={`mt-0.5 flex-shrink-0 ${
                        activeTier === index
                          ? "text-forge-orange"
                          : "text-text-muted"
                      }`}
                    >
                      <path
                        d="M3 7l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href={raydiumHref}
            target={PROJECT_CA ? "_blank" : undefined}
            rel={PROJECT_CA ? "noopener noreferrer" : undefined}
            className="cursor-hammer inline-block px-8 py-3 border border-forge-orange text-forge-orange font-display uppercase tracking-wider text-sm rounded hover:bg-forge-orange hover:text-white transition-all duration-200 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          >
            Get $KAZT on Raydium
          </a>
        </div>
      </div>
    </section>
  );
}

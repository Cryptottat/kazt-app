"use client";

const STEPS = [
  {
    number: "01",
    title: "Design",
    description:
      "Drag and drop rule blocks onto the forge canvas. Configure ordering, batching, matching, priority, and filter rules with precision.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="text-forge-orange"
      >
        {/* Blueprint / design icon */}
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="12"
          y="12"
          width="10"
          height="10"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="26"
          y="12"
          width="10"
          height="10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <rect
          x="12"
          y="26"
          width="10"
          height="10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <rect
          x="26"
          y="26"
          width="10"
          height="10"
          fill="currentColor"
          opacity="0.3"
        />
        <line
          x1="22"
          y1="17"
          x2="26"
          y2="17"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="17"
          y1="22"
          x2="17"
          y2="26"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Simulate",
    description:
      "Run transaction simulations against your rule configuration. Identify conflicts, test edge cases, and validate behavior before deployment.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="text-molten-gold"
      >
        {/* Fire / simulation icon */}
        <path
          d="M24 4C24 4 14 16 14 28a10 10 0 0020 0C34 16 24 4 24 4z"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <path
          d="M24 16c0 0-5 6-5 14a5 5 0 0010 0c0-8-5-14-5-14z"
          fill="currentColor"
          opacity="0.4"
        />
        <circle cx="24" cy="30" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Export your validated rules as Anchor IDL or JSON. Deploy directly to Solana with one click. Your rules are now set in chain, immutable and executable.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="text-cast-green"
      >
        {/* Chain / deploy icon */}
        <path
          d="M20 28l8-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="8"
          y="24"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <rect
          x="24"
          y="8"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M16 32l-2 2m4-4l-2 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polyline
          points="30,14 33,17 38,12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-forge-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary">
            How It Works
          </h2>
          <div className="mt-4 w-20 h-[2px] bg-forge-orange mx-auto" />
          <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto">
            Three steps from concept to on-chain execution. No Rust required.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="group relative bg-bg-card border border-wire-border rounded-lg p-8 transition-all duration-300 hover:border-forge-orange/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)]"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-2 font-display text-6xl font-bold text-forge-orange/10 select-none group-hover:text-forge-orange/20 transition-colors">
                {step.number}
              </div>

              {/* Icon */}
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-text-primary mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector line between cards (desktop) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 sm:-right-4 w-8 h-[2px] bg-wire-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

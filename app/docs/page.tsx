"use client";

const BLOCK_TYPES = [
  {
    name: "Ordering",
    color: "#F97316",
    description: "Transaction sequencing rules",
    options: ["FIFO (First In, First Out)", "Price-Time Priority", "Pro-Rata"],
  },
  {
    name: "Batching",
    color: "#F59E0B",
    description: "Group transactions into batches",
    options: ["Interval-based batching", "Max batch size limits"],
  },
  {
    name: "Matching",
    color: "#10B981",
    description: "Transaction matching engines",
    options: ["CLOB (Central Limit Order Book)", "AMM (Automated Market Maker)", "RFQ (Request for Quote)"],
  },
  {
    name: "Priority",
    color: "#6366F1",
    description: "Priority assignment rules",
    options: ["Stake-weighted priority", "Fee-based priority", "Token-hold priority"],
  },
  {
    name: "Filter",
    color: "#EF4444",
    description: "Transaction filtering rules",
    options: ["Address blacklist/whitelist", "Transaction size limits", "Custom conditions"],
  },
];

const TIERS = [
  { name: "Free", threshold: "0 KAZT", features: ["3 designs/day", "Simulate", "No save/export"] },
  { name: "Basic", threshold: "1,000 KAZT", features: ["Unlimited designs", "Save up to 10 rules", "JSON export"] },
  { name: "Pro", threshold: "10,000 KAZT", features: ["Unlimited saves", "Anchor code generation", "BAM config"] },
  { name: "Elite", threshold: "100,000 KAZT", features: ["On-chain deploy", "Marketplace access", "API access"] },
  { name: "Whale", threshold: "1,000,000 KAZT", features: ["Reduced marketplace fees (2.5%)", "Priority support", "All features"] },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            Everything you need to know about ACE rules and how to build them with Kazt.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 rounded-lg border border-wire-border bg-bg-elevated/50">
          <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary mb-4">Contents</h2>
          <ul className="space-y-2">
            {["What is ACE?", "Rule Block Types", "How Rule Forge Works", "Tier System", "Template Marketplace"].map((item, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-forge-orange hover:text-forge-orange-light transition-colors text-sm">
                  {i + 1}. {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section 1: What is ACE */}
        <section id="section-0" className="mb-16">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-wire-border">
            1. What is ACE?
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              <strong className="text-text-primary">ACE (Application Controlled Execution)</strong> is a framework that lets Solana protocols define their own transaction execution rules. Instead of relying on default validator ordering, protocols can specify exactly how transactions are sequenced, batched, matched, prioritized, and filtered.
            </p>
            <p>
              Without ACE, every unprotected swap on Solana is vulnerable to MEV (Maximal Extractable Value) attacks. Bots see pending transactions in the mempool and exploit them through frontrunning, sandwich attacks, and other strategies. Estimated daily MEV damage across Solana DEXs: <strong className="text-forge-orange">$5-10M</strong>.
            </p>
            <p>
              ACE is the solution. But writing ACE rules manually requires CLI access, raw code, and days of testing. Most protocol teams give up before they start.
            </p>
            <p>
              <strong className="text-text-primary">Kazt makes ACE accessible.</strong> Drag blocks onto a canvas. Connect them. Simulate. Export. No CLI. No boilerplate.
            </p>
          </div>
        </section>

        {/* Section 2: Rule Block Types */}
        <section id="section-1" className="mb-16">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-wire-border">
            2. Rule Block Types
          </h2>
          <p className="text-text-secondary mb-6">
            Kazt provides 5 fundamental block types. Combine them to build complete ACE execution rulesets.
          </p>
          <div className="space-y-4">
            {BLOCK_TYPES.map((block) => (
              <div
                key={block.name}
                className="p-5 rounded-lg border border-wire-border bg-bg-elevated/30 hover:border-opacity-60 transition-colors"
                style={{ borderLeftWidth: 4, borderLeftColor: block.color }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: block.color }}
                  />
                  <h3 className="font-display text-lg font-bold text-text-primary">{block.name}</h3>
                </div>
                <p className="text-text-secondary text-sm mb-3">{block.description}</p>
                <ul className="space-y-1">
                  {block.options.map((opt) => (
                    <li key={opt} className="text-text-secondary text-sm flex items-center gap-2">
                      <span className="text-text-secondary/40">--</span> {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: How Rule Forge Works */}
        <section id="section-2" className="mb-16">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-wire-border">
            3. How Rule Forge Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Design",
                desc: "Open the Rule Forge canvas. Drag blocks from the palette onto the workspace. Each block represents an ACE rule primitive. Connect blocks to define the execution flow.",
              },
              {
                step: "02",
                title: "Validate",
                desc: "The rule engine checks your configuration in real time. Circular dependencies, contradictory conditions, and parameter mismatches are flagged instantly. No silent failures.",
              },
              {
                step: "03",
                title: "Simulate",
                desc: "Run sample transactions through your ruleset. See exactly which transactions pass, get filtered, get reordered, or get batched. Verify before you ship.",
              },
              {
                step: "04",
                title: "Export",
                desc: "Export your validated ruleset as JSON (for integration pipelines) or as Anchor code (for direct on-chain deployment). Copy, paste, ship.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-forge-orange/10 flex items-center justify-center">
                  <span className="font-display text-forge-orange font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Tier System */}
        <section id="section-3" className="mb-16">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-wire-border">
            4. Tier System
          </h2>
          <p className="text-text-secondary mb-6">
            Access to Kazt features is based on $KAZT token holdings. The free tier lets you try everything. Hold tokens to unlock the full forge.
          </p>
          <div className="space-y-3">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className="p-4 rounded-lg border border-wire-border bg-bg-elevated/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-text-primary">{tier.name}</h3>
                  <span className="text-sm text-forge-orange font-mono">{tier.threshold}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tier.features.map((f) => (
                    <span key={f} className="text-xs px-2 py-1 rounded bg-bg text-text-secondary border border-wire-border">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Template Marketplace */}
        <section id="section-4" className="mb-16">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-wire-border">
            5. Template Marketplace
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              The Template Marketplace lets builders trade proven ACE rulesets using $KAZT. Buy battle-tested configurations instead of building from scratch. Sell your expertise to other protocol teams.
            </p>
            <p>
              <strong className="text-text-primary">For buyers:</strong> Browse templates by category. Preview the full block layout and simulation results. Purchase with $KAZT and the template loads directly into your Rule Forge canvas.
            </p>
            <p>
              <strong className="text-text-primary">For sellers:</strong> Build a ruleset in Rule Forge. Test it thoroughly. Publish to the marketplace with a description and price in $KAZT. Every sale: you receive 95% of the purchase price.
            </p>
            <div className="mt-6 p-4 rounded-lg border border-wire-border bg-bg-elevated/30">
              <h4 className="font-display text-sm font-bold text-text-primary mb-3">Seed Templates Available</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "DEX AMM Protection Pack",
                  "Lending Protocol Pack",
                  "Orderbook Fairness Pack",
                  "NFT Mint Guard",
                  "Perpetuals MEV Shield",
                  "Staking Reward Sequencer",
                ].map((name) => (
                  <div key={name} className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forge-orange flex-shrink-0" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-wire-border text-center">
          <p className="text-text-secondary text-sm">
            Pour your rules. Set them in chain.
          </p>
        </div>
      </div>
    </div>
  );
}

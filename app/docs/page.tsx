"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/common/Header";

const BLOCK_TYPES = [
  {
    name: "Ordering",
    color: "#F97316",
    description:
      "Define how transactions are sequenced before execution. Ordering blocks determine the queue discipline applied to incoming transactions. Without explicit ordering, validators use default leader scheduling which is vulnerable to MEV extraction. By enforcing FIFO, price-time, or pro-rata ordering, protocols ensure fair sequencing that cannot be manipulated by searchers or block producers.",
    options: [
      "FIFO (First In, First Out) -- strict arrival-time ordering",
      "Price-Time Priority -- highest price wins, ties broken by arrival",
      "Pro-Rata Distribution -- allocate proportionally across participants",
    ],
  },
  {
    name: "Batching",
    color: "#F59E0B",
    description:
      "Group multiple transactions into a single batch for efficient processing. Batching blocks collect transactions over a configurable time window and execute them atomically. This prevents sandwich attacks because all transactions in a batch are treated as simultaneous -- there is no 'before' or 'after' within a batch for an attacker to exploit.",
    options: [
      "Interval-based batching (50ms - 5000ms windows)",
      "Max batch size limits (1 - 200 transactions)",
      "Minimum batch threshold before execution",
    ],
  },
  {
    name: "Matching",
    color: "#10B981",
    description:
      "Determine how buy and sell orders are paired together. Matching blocks define the trade execution engine used to pair counterparties. Different matching engines serve different protocol types -- CLOB for orderbook DEXs, AMM for liquidity pool protocols, and RFQ for institutional or OTC flows.",
    options: [
      "CLOB (Central Limit Order Book) -- traditional price-level matching",
      "AMM (Automated Market Maker) -- curve-based liquidity matching",
      "RFQ (Request for Quote) -- bilateral quote-driven matching",
    ],
  },
  {
    name: "Priority",
    color: "#6366F1",
    description:
      "Assign priority scores to transactions based on configurable factors. Priority blocks let protocols define what makes a transaction 'important' in their context. Instead of defaulting to fee-based priority (which favors MEV extractors with deep pockets), protocols can weight stake holdings, token balances, or custom criteria.",
    options: [
      "Stake-weighted priority -- higher SOL stake = higher priority",
      "Fee-based priority -- higher tip = higher priority",
      "Token-hold priority -- protocol token holders get preference",
    ],
  },
  {
    name: "Filter",
    color: "#EF4444",
    description:
      "Screen transactions before they enter the execution pipeline. Filter blocks act as gatekeepers, allowing protocols to block known MEV bots, enforce transaction size limits, or restrict access to whitelisted addresses. Filters run before all other blocks, so rejected transactions never consume processing resources.",
    options: [
      "Address blacklist -- block known MEV bots and bad actors",
      "Address whitelist -- restrict to approved participants only",
      "Transaction size limits (min and max SOL value)",
      "Custom filter conditions based on instruction data",
    ],
  },
];

const TIERS = [
  {
    name: "Free",
    threshold: "0 KAZT",
    rate: "3 designs / day",
    features: [
      "3 designs per day",
      "Simulate rules",
      "No save or export",
      "Community support only",
    ],
  },
  {
    name: "Basic",
    threshold: "100,000 KAZT",
    rate: "50 designs / day",
    features: [
      "50 designs per day",
      "Save up to 10 rules",
      "JSON export",
      "Email support",
    ],
  },
  {
    name: "Pro",
    threshold: "1,000,000 KAZT",
    rate: "500 designs / day",
    features: [
      "500 designs per day",
      "Unlimited saves",
      "Anchor code generation",
      "BAM config export",
      "Priority support",
    ],
  },
  {
    name: "Elite",
    threshold: "5,000,000 KAZT",
    rate: "Unlimited",
    features: [
      "Unlimited designs",
      "On-chain deployment",
      "Marketplace access",
      "API access",
      "Dedicated support channel",
    ],
  },
  {
    name: "Whale",
    threshold: "25,000,000 KAZT",
    rate: "Unlimited",
    features: [
      "All Elite features",
      "Reduced marketplace fees (2.5%)",
      "Priority support with SLA",
      "Early access to new features",
      "Governance voting rights",
    ],
  },
];

const BLOCK_PARAMS = [
  {
    block: "Ordering",
    color: "#F97316",
    params: [
      { name: "method", type: "enum", values: "FIFO | price_time | pro_rata", description: "Queue discipline for incoming transactions" },
      { name: "tiebreaker", type: "enum", values: "timestamp | fee | random", description: "How to resolve ties when two transactions have equal priority" },
    ],
  },
  {
    block: "Batching",
    color: "#F59E0B",
    params: [
      { name: "interval_ms", type: "int", values: "50 - 5000", description: "Time window in milliseconds to collect transactions before executing the batch" },
      { name: "max_batch", type: "int", values: "1 - 200", description: "Maximum number of transactions per batch" },
      { name: "min_batch", type: "int", values: "1 - 50", description: "Minimum transactions required to trigger batch execution" },
    ],
  },
  {
    block: "Matching",
    color: "#10B981",
    params: [
      { name: "engine", type: "enum", values: "clob | amm | rfq", description: "Trade matching algorithm used to pair buy and sell orders" },
      { name: "partial_fill", type: "bool", values: "true | false", description: "Whether to allow partial order fills or require all-or-nothing execution" },
    ],
  },
  {
    block: "Priority",
    color: "#6366F1",
    params: [
      { name: "factor", type: "enum", values: "stake | fee | token_hold", description: "The metric used to calculate transaction priority score" },
      { name: "weight", type: "float", values: "0.1 - 10.0", description: "Multiplier applied to the priority factor (higher = more impact)" },
    ],
  },
  {
    block: "Filter",
    color: "#EF4444",
    params: [
      { name: "blacklist", type: "address[]", values: "Pubkey list", description: "Array of Solana addresses to block from submitting transactions" },
      { name: "whitelist", type: "address[]", values: "Pubkey list", description: "Array of Solana addresses allowed to submit (if set, all others blocked)" },
      { name: "max_size", type: "float", values: "0.01 - 100000 SOL", description: "Maximum transaction value in SOL" },
      { name: "min_size", type: "float", values: "0.001 - 1000 SOL", description: "Minimum transaction value in SOL" },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need to know Rust to use Kazt?",
    a: "No. Kazt is a fully visual builder. You drag blocks onto a canvas, configure parameters through a properties panel, and the forge generates production-ready Rust code (Anchor IDL) or JSON configuration for you. You never need to write a single line of Rust, though you can always inspect and modify the generated output if you choose.",
  },
  {
    q: "How accurate is the simulation?",
    a: "The simulator runs your rules against realistic sample transaction data including normal swaps, potential sandwich attacks, and edge cases. It accurately models how your rule pipeline would process each transaction. However, on-chain behavior may differ under extreme network congestion or if the underlying protocol changes its transaction format. We recommend testing on devnet before mainnet deployment.",
  },
  {
    q: "Can I export and modify the generated code?",
    a: "Yes. JSON export is always available at Basic tier and above. Anchor IDL export (which generates Rust code) is available at Pro tier and above. Both formats are fully editable -- you own the output. Many advanced users export from Kazt, then fine-tune specific parameters in their own development environment before deploying.",
  },
  {
    q: "What happens if my rules conflict with each other?",
    a: "The built-in conflict detection engine performs real-time dependency graph analysis as you build. It catches circular references (Block A depends on Block B which depends on Block A), duplicate ordering rules, contradictory filter settings (same address on both blacklist and whitelist), and parameter mismatches. You cannot export a rule set that has unresolved conflicts.",
  },
  {
    q: "How does the Template Marketplace work?",
    a: "The marketplace lets experienced builders publish verified rule templates that other users can purchase with $KAZT tokens. Each template includes a description, block count, preview visualization, and the seller's verification status. After purchase, the template loads directly into your forge canvas where you can customize it. Sellers receive 95% of each sale (2.5% for Whale tier sellers), with the remainder going to the protocol treasury.",
  },
  {
    q: "What is $KAZT used for?",
    a: "$KAZT is the SPL utility token that powers the Kazt ecosystem. Its primary uses are: (1) Hold tokens to unlock forge tiers with progressively more features, (2) Purchase templates from the marketplace, (3) Earn by selling your own templates, (4) Access premium features like on-chain deployment and API access. The token is on the Solana blockchain and can be traded on supported DEXs.",
  },
  {
    q: "Is Kazt free to use?",
    a: "Yes, the Free tier lets you create up to 3 rule designs per day and run simulations without holding any $KAZT tokens. However, Free tier does not include save or export functionality. To unlock saving, exporting, and advanced features, you need to hold $KAZT tokens to qualify for a higher tier (Basic starts at 100,000 KAZT).",
  },
  {
    q: "How do I connect my wallet?",
    a: "Click the 'Connect Wallet' button in the top navigation bar. Kazt supports all major Solana wallets including Phantom, Solflare, Backpack, and Ledger (via adapter). Once connected, the app automatically reads your $KAZT token balance to determine your tier level. Your wallet address is also used to sign rule exports and marketplace transactions.",
  },
  {
    q: "What blockchains does Kazt support?",
    a: "Kazt is built exclusively for Solana. ACE (Application Controlled Execution) is a Solana-native framework, and the Jito BAM (Block Auction Marketplace) operates only on the Solana network. There are currently no plans to support other chains, as the ACE framework is tightly integrated with Solana's validator architecture and leader scheduling.",
  },
  {
    q: "Is my data stored? What about privacy?",
    a: "Rule designs for logged-in users (Basic tier and above) are stored in our PostgreSQL database, encrypted at rest. Your wallet address and tier level are cached in Redis for performance. We do not store your private keys -- wallet interactions are handled entirely client-side through standard Solana wallet adapters. Free tier users' designs exist only in browser memory and are lost when the page is closed.",
  },
  {
    q: "Can I use Kazt without holding any tokens?",
    a: "Yes. The Free tier is available to everyone with zero $KAZT balance. You can design up to 3 rule sets per day and run simulations to learn how ACE rules work. This is a great way to explore the platform before committing to a token purchase. However, you will need at least Basic tier (100,000 KAZT) to save your work or export configurations.",
  },
  {
    q: "What is the difference between JSON export and Anchor IDL export?",
    a: "JSON export produces a human-readable configuration file that describes your rule set -- block types, connections, and all parameters. This is useful for storage, sharing, version control, and loading back into the forge. Anchor IDL export generates actual Rust program code using the Anchor framework, ready for compilation and on-chain deployment via Jito BAM. JSON is available at Basic tier; Anchor IDL requires Pro tier or above.",
  },
];

const SECTIONS = [
  { id: "what-is-ace", label: "What is ACE?" },
  { id: "mev-problem", label: "The MEV Problem" },
  { id: "why-kazt", label: "Why Kazt?" },
  { id: "block-types", label: "Rule Blocks" },
  { id: "block-params", label: "Block Parameters" },
  { id: "how-forge-works", label: "How Forge Works" },
  { id: "simulation", label: "Simulation" },
  { id: "export", label: "Export & Deploy" },
  { id: "tier-system", label: "Tier System" },
  { id: "template-marketplace", label: "Marketplace" },
  { id: "architecture", label: "Architecture" },
  { id: "faq", label: "FAQ" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("what-is-ace");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { root, rootMargin: "-20% 0px -70% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 pt-16 overflow-hidden">
        <div className="h-full lg:flex">
          {/* Main content */}
          <div ref={scrollRef} className="flex-1 min-w-0 h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 py-10 lg:py-14">
              {/* Page title */}
              <div className="mb-10">
                <h1 className="font-display text-xl sm:text-2xl text-text-primary tracking-wider uppercase mb-3">
                  Documentation
                </h1>
                <p className="text-sm text-text-secondary">
                  Everything you need to know about Kazt, ACE rules, and the
                  Rule Forge. From concept to on-chain deployment.
                </p>
              </div>

              {/* Mobile nav */}
              <div className="lg:hidden mb-8 overflow-x-auto">
                <div className="flex gap-1.5 pb-2">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={`whitespace-nowrap px-3 py-1.5 pixel-border text-[9px] font-display uppercase tracking-wider transition-colors ${
                        activeSection === s.id
                          ? "bg-forge-orange/10 border-forge-orange/30 text-forge-orange"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ================================================ */}
              {/* 01 -- What is ACE?                                */}
              {/* ================================================ */}
              <section id="what-is-ace" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  01 -- What is ACE?
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    <strong className="text-text-primary">
                      ACE (Application Controlled Execution)
                    </strong>{" "}
                    is a framework that lets Solana protocols define their own
                    transaction execution rules. Instead of relying on default
                    validator ordering -- where the leader node decides
                    transaction sequence based on fees and arrival time --
                    protocols can specify exactly how their transactions are
                    sequenced, batched, matched, and filtered.
                  </p>
                  <p>
                    In the default Solana execution model, validators process
                    transactions in whatever order they choose. This creates an
                    opportunity for MEV (Maximal Extractable Value) searchers to
                    insert their own transactions before or after yours,
                    extracting profit at your expense. ACE changes this by giving
                    the <em>application</em> control over execution, not the
                    validator.
                  </p>
                  <p>
                    The term{" "}
                    <strong className="text-text-primary">
                      &quot;application controlled&quot;
                    </strong>{" "}
                    is key. It means the protocol itself -- the DEX, the lending
                    platform, the perpetuals exchange -- gets to define
                    transaction ordering rules, not the block producer. This is a
                    fundamental shift in how Solana transactions are processed.
                    The protocol becomes the authority on execution policy.
                  </p>
                  <p>
                    ACE rules are deployed through{" "}
                    <strong className="text-text-primary">
                      Jito BAM (Block Auction Marketplace)
                    </strong>
                    , the infrastructure layer that connects protocols to Solana
                    validators. When a protocol publishes ACE rules to BAM,
                    validators that participate in the Jito network agree to
                    respect those rules when producing blocks. This creates an
                    enforceable contract between the protocol and the network.
                  </p>
                  <p>
                    BAM also integrates with{" "}
                    <strong className="text-text-primary">
                      TEE-based encrypted mempools
                    </strong>{" "}
                    (Trusted Execution Environments). Transactions are encrypted
                    before entering the mempool, so validators and searchers
                    cannot read transaction contents until after ordering
                    decisions are made. This provides a cryptographic guarantee
                    that MEV extraction is not possible, even if a validator is
                    compromised.
                  </p>
                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="text-xs text-text-muted mb-1 font-mono">
                      TL;DR
                    </p>
                    <p className="text-sm text-text-primary">
                      ACE = custom transaction execution rules for Solana
                      protocols. Protocols define ordering, batching, matching,
                      priority, and filtering rules. Rules are deployed via Jito
                      BAM and enforced by validators. TEE encryption prevents
                      front-running at the mempool level.
                    </p>
                  </div>
                </div>
              </section>

              {/* ================================================ */}
              {/* 02 -- The MEV Problem                             */}
              {/* ================================================ */}
              <section id="mev-problem" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  02 -- The MEV Problem
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    <strong className="text-text-primary">
                      MEV (Maximal Extractable Value)
                    </strong>{" "}
                    refers to the profit that block producers and searchers can
                    extract by manipulating the order of transactions within a
                    block. On Solana, MEV extraction is estimated to cost regular
                    users{" "}
                    <span className="text-forge-orange font-mono">
                      $5-10 million per day
                    </span>{" "}
                    -- a hidden tax on every swap, every trade, and every DeFi
                    interaction.
                  </p>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      Sandwich Attack -- Step by Step
                    </p>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          01.
                        </span>
                        <span>
                          You submit a swap: 100 SOL for Token X on a DEX. Your
                          transaction enters the mempool, visible to everyone.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          02.
                        </span>
                        <span>
                          An MEV bot detects your pending transaction and
                          calculates the price impact your swap will have.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          03.
                        </span>
                        <span>
                          The bot submits a{" "}
                          <strong className="text-text-primary">
                            front-run transaction
                          </strong>{" "}
                          -- buying Token X before you, pushing the price up.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          04.
                        </span>
                        <span>
                          Your swap executes at the now-inflated price. You
                          receive fewer tokens than expected.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          05.
                        </span>
                        <span>
                          The bot submits a{" "}
                          <strong className="text-text-primary">
                            back-run transaction
                          </strong>{" "}
                          -- selling Token X at the inflated price for instant
                          profit. You are &quot;sandwiched.&quot;
                        </span>
                      </div>
                    </div>
                  </div>

                  <p>
                    <strong className="text-text-primary">Front-running</strong>{" "}
                    is a simpler variant: a bot sees your pending transaction,
                    submits the same trade with a higher fee to ensure it
                    executes first, and profits from the price movement your
                    transaction will cause. This is possible because default
                    Solana ordering prioritizes fee-paying transactions.
                  </p>
                  <p>
                    <strong className="text-text-primary">
                      Transaction reordering
                    </strong>{" "}
                    is the most general form of MEV. Validators or searchers
                    rearrange transaction order within a block to maximize their
                    own profit. This can affect liquidations, arbitrage
                    opportunities, oracle updates, and any time-sensitive DeFi
                    operation.
                  </p>
                  <p>
                    For regular users, MEV is an invisible cost. You set 1%
                    slippage on a swap thinking that is your maximum cost, but
                    MEV bots consistently push you to that slippage limit,
                    extracting the difference as profit. Over time, this amounts
                    to billions of dollars transferred from regular users to
                    sophisticated automated systems.
                  </p>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      How ACE Solves It
                    </p>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <p>
                        ACE eliminates MEV by removing the validator&apos;s
                        ability to reorder transactions for profit:
                      </p>
                      <ul className="space-y-1.5 ml-1">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-forge-orange flex-shrink-0 mt-1" />
                          <span>
                            <strong className="text-text-primary">
                              Ordering rules
                            </strong>{" "}
                            enforce FIFO or fair sequencing -- bots cannot jump
                            the queue
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-forge-orange flex-shrink-0 mt-1" />
                          <span>
                            <strong className="text-text-primary">
                              Batching rules
                            </strong>{" "}
                            group transactions so there is no &quot;before&quot;
                            or &quot;after&quot; to exploit
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-forge-orange flex-shrink-0 mt-1" />
                          <span>
                            <strong className="text-text-primary">
                              Filter rules
                            </strong>{" "}
                            block known MEV bot addresses before they enter the
                            pipeline
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-forge-orange flex-shrink-0 mt-1" />
                          <span>
                            <strong className="text-text-primary">
                              TEE encryption
                            </strong>{" "}
                            hides transaction contents until after ordering is
                            decided
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================================================ */}
              {/* 03 -- Why Kazt?                                   */}
              {/* ================================================ */}
              <section id="why-kazt" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  03 -- Why Kazt?
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    Today, writing ACE rules requires deep expertise in Rust,
                    Solana&apos;s runtime, the Anchor framework, and the Jito BAM
                    SDK. A typical rule configuration takes{" "}
                    <span className="text-forge-orange font-mono">
                      3-7 days
                    </span>{" "}
                    of manual coding by an experienced Solana developer, and
                    around{" "}
                    <span className="text-forge-orange font-mono">
                      40% of Jito BAM setups fail
                    </span>{" "}
                    on the first attempt due to configuration complexity,
                    parameter mismatches, or dependency errors.
                  </p>
                  <p>
                    This means only well-funded protocol teams with dedicated
                    Solana developers can protect their users from MEV. Smaller
                    protocols, individual traders, and new projects are left
                    exposed.
                  </p>
                  <p>
                    <strong className="text-text-primary">
                      Kazt is a visual ACE rule builder.
                    </strong>{" "}
                    It replaces the entire manual coding process with a
                    drag-and-drop canvas where you assemble rule blocks, connect
                    them to define execution flow, simulate with sample
                    transactions, and export production-ready code. No Rust
                    knowledge required. No command-line tools. No configuration
                    files to manually edit.
                  </p>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-text-muted uppercase tracking-wider mb-3">
                      Before Kazt vs. After Kazt
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-text-muted font-mono mb-2">
                          Before (CLI)
                        </p>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-red-500 flex-shrink-0 mt-1.5" />
                            3-7 days development time
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-red-500 flex-shrink-0 mt-1.5" />
                            Requires Rust + Anchor expertise
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-red-500 flex-shrink-0 mt-1.5" />
                            40% first-attempt failure rate
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-red-500 flex-shrink-0 mt-1.5" />
                            No simulation before deploy
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-red-500 flex-shrink-0 mt-1.5" />
                            Manual conflict checking
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-text-muted font-mono mb-2">
                          After (Kazt)
                        </p>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-emerald-500 flex-shrink-0 mt-1.5" />
                            15-30 minutes to build
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-emerald-500 flex-shrink-0 mt-1.5" />
                            Visual drag-and-drop interface
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-emerald-500 flex-shrink-0 mt-1.5" />
                            Built-in validation catches errors
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-emerald-500 flex-shrink-0 mt-1.5" />
                            Simulate before deployment
                          </li>
                          <li className="flex items-start gap-2 text-text-secondary">
                            <span className="w-1 h-1 bg-emerald-500 flex-shrink-0 mt-1.5" />
                            Automatic conflict detection
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        label: "For Protocol Teams",
                        desc: "Protect your users from MEV without hiring a dedicated Solana/Rust developer. Deploy ACE rules in minutes instead of days. Iterate on rule configurations with instant visual feedback.",
                      },
                      {
                        label: "For Individual Traders",
                        desc: "Understand how MEV protection works by building and simulating rules. Use the marketplace to purchase proven rule configurations from experienced builders.",
                      },
                      {
                        label: "For Developers",
                        desc: "Rapid prototyping for ACE rules. Build visually, export as Anchor IDL, then customize the generated Rust code in your own development environment. Cut days of boilerplate.",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="pixel-border bg-bg-card/30 p-4"
                      >
                        <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-2">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ================================================ */}
              {/* 04 -- Rule Block Types                            */}
              {/* ================================================ */}
              <section id="block-types" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  04 -- Rule Block Types
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    Kazt provides five fundamental building blocks that combine
                    to form any ACE rule configuration. Each block represents a
                    distinct phase of transaction processing. Blocks are
                    connected on the forge canvas to define the execution
                    pipeline -- transactions flow through each block in sequence.
                  </p>
                  <p>
                    You can use any combination of blocks. A minimal rule might
                    use only a Filter and an Ordering block. A comprehensive
                    rule set for a DEX might chain all five: Filter incoming
                    transactions, Batch them into groups, Order within each
                    batch, Match buy and sell sides, then apply Priority scoring
                    for execution preference.
                  </p>
                </div>
                <div className="space-y-3 mt-4">
                  {BLOCK_TYPES.map((block) => (
                    <div
                      key={block.name}
                      className="pixel-border bg-bg-card/30 p-4"
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: block.color,
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <span
                          className="w-2.5 h-2.5"
                          style={{ backgroundColor: block.color }}
                        />
                        <h3 className="font-display text-[10px] text-text-primary uppercase tracking-wider">
                          {block.name}
                        </h3>
                      </div>
                      <p className="text-xs text-text-secondary mb-2">
                        {block.description}
                      </p>
                      <ul className="space-y-1">
                        {block.options.map((opt) => (
                          <li
                            key={opt}
                            className="text-xs text-text-muted flex items-center gap-2"
                          >
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0" />{" "}
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================================================ */}
              {/* 05 -- Block Parameters                            */}
              {/* ================================================ */}
              <section id="block-params" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  05 -- Block Parameters
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    Each block type has configurable parameters that control its
                    behavior. When you select a block on the forge canvas, its
                    parameters appear in the properties panel on the right side.
                    This section is a complete reference for every parameter
                    available on each block type.
                  </p>
                  <p>
                    Parameters with enum types present a dropdown selector.
                    Numeric parameters show a slider with min/max bounds. Boolean
                    parameters are toggles. Address arrays open an editor where
                    you can paste Solana public keys one per line.
                  </p>
                </div>
                <div className="space-y-4 mt-4">
                  {BLOCK_PARAMS.map((block) => (
                    <div key={block.block} className="pixel-border bg-bg-card/30 p-4" style={{ borderLeftWidth: 3, borderLeftColor: block.color }}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-2.5 h-2.5" style={{ backgroundColor: block.color }} />
                        <h3 className="font-display text-[10px] text-text-primary uppercase tracking-wider">
                          {block.block} Parameters
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-wire-border">
                              <th className="text-left py-1.5 pr-3 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Parameter</th>
                              <th className="text-left py-1.5 pr-3 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Type</th>
                              <th className="text-left py-1.5 pr-3 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Values</th>
                              <th className="text-left py-1.5 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {block.params.map((param) => (
                              <tr key={param.name} className="border-b border-wire-border/30">
                                <td className="py-1.5 pr-3 text-forge-orange font-mono">{param.name}</td>
                                <td className="py-1.5 pr-3 text-text-muted font-mono">{param.type}</td>
                                <td className="py-1.5 pr-3 text-text-secondary font-mono text-[10px]">{param.values}</td>
                                <td className="py-1.5 text-text-secondary">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================================================ */}
              {/* 06 -- How Forge Works                             */}
              {/* ================================================ */}
              <section id="how-forge-works" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  06 -- How Rule Forge Works
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed mb-4">
                  <p>
                    The Rule Forge is Kazt&apos;s core interface -- a visual
                    canvas built on{" "}
                    <strong className="text-text-primary">React Flow</strong>{" "}
                    where you assemble ACE rule pipelines by dragging, dropping,
                    and connecting blocks. The forge is divided into three areas:
                    a block palette on the left, the canvas in the center, and a
                    properties panel on the right.
                  </p>
                  <p>
                    The{" "}
                    <strong className="text-text-primary">block palette</strong>{" "}
                    contains all five block types (Ordering, Batching, Matching,
                    Priority, Filter) as draggable items. Click or drag a block
                    to place it on the canvas. The{" "}
                    <strong className="text-text-primary">canvas</strong> is an
                    infinite, pannable workspace where blocks appear as nodes
                    with input and output ports. Connect blocks by dragging from
                    an output port to an input port -- this defines the
                    transaction flow. The{" "}
                    <strong className="text-text-primary">
                      properties panel
                    </strong>{" "}
                    shows the configurable parameters for whichever block is
                    currently selected.
                  </p>
                  <p>
                    As you build, the forge provides{" "}
                    <strong className="text-text-primary">
                      real-time validation feedback
                    </strong>
                    . Invalid connections (like connecting two output ports) are
                    rejected. Circular dependencies are detected and highlighted
                    with a red border. Conflicting parameters (like a Filter
                    block with the same address on both blacklist and whitelist)
                    trigger a warning badge on the block.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Design",
                      desc: "Drag rule blocks from the palette onto the canvas. Connect them to define execution flow. Each block has configurable parameters you can tune in the properties panel. Zoom in and out with scroll, pan by dragging empty canvas space. Blocks snap to a grid for clean layouts.",
                    },
                    {
                      step: "02",
                      title: "Validate",
                      desc: "The built-in conflict detection engine checks for circular dependencies, duplicate block types, and parameter mismatches in real time. Issues appear as colored badges on affected blocks -- red for errors (must fix before export), yellow for warnings (recommended to fix). The validation panel lists all issues with one-click navigation to the problem block.",
                    },
                    {
                      step: "03",
                      title: "Simulate",
                      desc: "Run 1-20 sample transactions through your rule pipeline. The simulator generates realistic transaction data including normal swaps, potential sandwich attacks, and edge cases. See which transactions get included, filtered, reordered, or batched. A detailed report shows the outcome for each transaction. See the Simulation section below for full details.",
                    },
                    {
                      step: "04",
                      title: "Export",
                      desc: "Export your rules as JSON for storage and sharing, or generate Anchor IDL code for direct on-chain deployment via Jito BAM. JSON export is available at Basic tier and above. Anchor IDL export requires Pro tier. See the Export & Deploy section below for full details on each format.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-10 h-10 pixel-border-orange bg-forge-orange/5 flex items-center justify-center group-hover:bg-forge-orange/10 transition-colors">
                        <span className="font-display text-[8px] text-forge-orange">
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-[10px] text-text-primary uppercase tracking-wider mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================================================ */}
              {/* 07 -- Simulation                                  */}
              {/* ================================================ */}
              <section id="simulation" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  07 -- Simulation
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    The simulator is your testing ground before deploying rules
                    to mainnet. It generates realistic sample transactions and
                    runs them through your rule pipeline, showing you exactly how
                    each transaction would be processed. This catches
                    configuration errors, unexpected filter behavior, and
                    performance issues before they affect real users.
                  </p>
                  <p>
                    You can run simulations with{" "}
                    <span className="text-forge-orange font-mono">
                      1 to 20 transactions
                    </span>{" "}
                    per run. The simulator generates a mix of transaction types:
                    normal swaps, potential sandwich attack pairs, large
                    transactions near size limits, and edge cases specific to
                    your block configuration. Each simulation run produces a
                    detailed{" "}
                    <strong className="text-text-primary">
                      SimulationReport
                    </strong>
                    .
                  </p>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      Transaction Outcomes
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-3">
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex-shrink-0">
                          INCLUDED
                        </span>
                        <span className="text-text-secondary">
                          Transaction passed all filters and was included in the
                          execution pipeline. The report shows its final position
                          in the ordering queue.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 font-mono text-[10px] flex-shrink-0">
                          FILTERED
                        </span>
                        <span className="text-text-secondary">
                          Transaction was blocked by a Filter block. The report
                          shows which filter rule triggered the rejection (e.g.,
                          blacklisted address, exceeded max_size).
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] flex-shrink-0">
                          BATCHED
                        </span>
                        <span className="text-text-secondary">
                          Transaction was collected into a batch by a Batching
                          block. The report shows which batch it belongs to and
                          how many other transactions share that batch.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-1.5 py-0.5 bg-zinc-500/20 text-zinc-400 font-mono text-[10px] flex-shrink-0">
                          REJECTED
                        </span>
                        <span className="text-text-secondary">
                          Transaction failed validation or caused a conflict in
                          the pipeline. The report shows the specific error and
                          which block rejected it.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      SimulationReport Contents
                    </p>
                    <div className="space-y-1.5 text-xs font-mono text-text-secondary">
                      <p>
                        <span className="text-text-muted">total_txns:</span>{" "}
                        number of transactions in the simulation
                      </p>
                      <p>
                        <span className="text-text-muted">included:</span>{" "}
                        count and list of included transactions
                      </p>
                      <p>
                        <span className="text-text-muted">filtered:</span>{" "}
                        count and list of filtered transactions with reasons
                      </p>
                      <p>
                        <span className="text-text-muted">batched:</span> count
                        and batch assignments
                      </p>
                      <p>
                        <span className="text-text-muted">rejected:</span>{" "}
                        count and error details
                      </p>
                      <p>
                        <span className="text-text-muted">ordering:</span>{" "}
                        final transaction sequence after all rules applied
                      </p>
                      <p>
                        <span className="text-text-muted">conflicts:</span>{" "}
                        any detected rule conflicts or warnings
                      </p>
                      <p>
                        <span className="text-text-muted">exec_time_ms:</span>{" "}
                        simulation execution time in milliseconds
                      </p>
                    </div>
                  </div>

                  <p>
                    <strong className="text-text-primary">
                      Interpreting conflict warnings:
                    </strong>{" "}
                    If the simulator detects that two blocks produce conflicting
                    results (for example, a Priority block promotes a transaction
                    that a Filter block would reject), it generates a conflict
                    warning. Conflict warnings do not prevent the simulation from
                    completing, but they indicate that your rule set may behave
                    unpredictably. Resolve all warnings before exporting for
                    production use.
                  </p>
                </div>
              </section>

              {/* ================================================ */}
              {/* 08 -- Export & Deploy                             */}
              {/* ================================================ */}
              <section id="export" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  08 -- Export &amp; Deploy
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    Once your rules pass validation and simulation, you can
                    export them in two formats. The format you choose depends on
                    your workflow and tier level.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="pixel-border bg-bg-card/30 p-4">
                      <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-2">
                        JSON Export
                      </p>
                      <p className="text-xs text-text-muted font-mono mb-2">
                        Available: Basic tier+
                      </p>
                      <div className="space-y-2 text-xs text-text-secondary">
                        <p>
                          Exports your entire rule set as a structured JSON file.
                          This is the universal format -- it can be stored in
                          version control, shared with teammates, loaded back
                          into the forge, or used as input for custom deployment
                          scripts.
                        </p>
                        <p className="text-text-muted font-mono text-[10px]">
                          Contents:
                        </p>
                        <ul className="space-y-1 ml-1">
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Rule metadata (name, version, author)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Block definitions with all parameters
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Connection graph (block-to-block edges)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Canvas layout positions
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Last simulation results
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="pixel-border bg-bg-card/30 p-4">
                      <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-2">
                        Anchor IDL Export
                      </p>
                      <p className="text-xs text-text-muted font-mono mb-2">
                        Available: Pro tier+
                      </p>
                      <div className="space-y-2 text-xs text-text-secondary">
                        <p>
                          Generates production-ready Rust code using the Anchor
                          framework. This is compilable Solana program code that
                          implements your rule set as an on-chain program,
                          complete with instruction handlers, account
                          validation, and error types.
                        </p>
                        <p className="text-text-muted font-mono text-[10px]">
                          Contents:
                        </p>
                        <ul className="space-y-1 ml-1">
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Anchor program scaffold (lib.rs)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Instruction definitions for each rule
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Account structs and validation logic
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            IDL JSON for client generation
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-text-muted flex-shrink-0 mt-1.5" />
                            Jito BAM configuration manifest
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      Jito BAM Deployment Flow
                    </p>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          01.
                        </span>
                        <span>
                          Export your rule set as Anchor IDL from the forge
                          (requires Pro tier or above).
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          02.
                        </span>
                        <span>
                          Compile the generated Rust code using{" "}
                          <span className="font-mono text-text-muted">
                            anchor build
                          </span>
                          . The code is pre-configured for the Jito BAM SDK.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          03.
                        </span>
                        <span>
                          Deploy the program to Solana devnet for testing using{" "}
                          <span className="font-mono text-text-muted">
                            anchor deploy
                          </span>
                          .
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          04.
                        </span>
                        <span>
                          Register your ACE rules with Jito BAM using the
                          included configuration manifest. This notifies
                          validators to respect your rules.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          05.
                        </span>
                        <span>
                          Deploy to mainnet. At Elite tier and above, Kazt can
                          handle the entire deployment process from the web UI.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================================================ */}
              {/* 09 -- Tier System                                 */}
              {/* ================================================ */}
              <section id="tier-system" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  09 -- Tier System
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    The tier system controls access to Kazt features based on how
                    many{" "}
                    <span className="text-forge-orange font-mono">$KAZT</span>{" "}
                    tokens you hold in your connected wallet. Tiers are
                    determined in real time -- the moment your token balance
                    crosses a threshold, your tier updates automatically. There
                    is no staking or locking required; simply holding the tokens
                    in your wallet is sufficient.
                  </p>
                  <p>
                    The tier system exists for two reasons: (1) to align
                    incentives between power users and the protocol, and (2) to
                    manage backend resources. Higher tiers consume more compute
                    (simulation, code generation, on-chain deployment), so token
                    holding ensures sustainable infrastructure costs.
                  </p>

                  <div className="pixel-border bg-bg-card/50 p-4 mb-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      Rate Limits by Tier
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-wire-border">
                            <th className="text-left py-1.5 pr-3 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Tier</th>
                            <th className="text-left py-1.5 pr-3 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Threshold</th>
                            <th className="text-left py-1.5 pr-3 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Designs/Day</th>
                            <th className="text-left py-1.5 text-text-muted font-mono font-normal uppercase text-[9px] tracking-wider">Simulations/Day</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { tier: "Free", threshold: "0", designs: "3", sims: "10" },
                            { tier: "Basic", threshold: "1,000", designs: "50", sims: "200" },
                            { tier: "Pro", threshold: "10,000", designs: "500", sims: "2,000" },
                            { tier: "Elite", threshold: "100,000", designs: "Unlimited", sims: "Unlimited" },
                            { tier: "Whale", threshold: "1,000,000", designs: "Unlimited", sims: "Unlimited" },
                          ].map((row) => (
                            <tr key={row.tier} className="border-b border-wire-border/30">
                              <td className="py-1.5 pr-3 text-text-primary font-mono">{row.tier}</td>
                              <td className="py-1.5 pr-3 text-forge-orange font-mono">{row.threshold} KAZT</td>
                              <td className="py-1.5 pr-3 text-text-secondary font-mono">{row.designs}</td>
                              <td className="py-1.5 text-text-secondary font-mono">{row.sims}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                  Hold $KAZT tokens to unlock progressively more powerful forge
                  capabilities.
                </p>
                <div className="space-y-2">
                  {TIERS.map((tier, i) => (
                    <div
                      key={tier.name}
                      className="pixel-border bg-bg-card/30 p-4 hover:bg-bg-card/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 bg-forge-orange"
                            style={{ opacity: 0.3 + i * 0.175 }}
                          />
                          <h3 className="font-display text-[10px] text-text-primary uppercase tracking-wider">
                            {tier.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] text-text-muted font-mono">{tier.rate}</span>
                          <span className="text-[10px] text-forge-orange font-mono">
                            {tier.threshold}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.features.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] px-2 py-0.5 bg-bg text-text-muted pixel-border"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================================================ */}
              {/* 10 -- Template Marketplace                        */}
              {/* ================================================ */}
              <section id="template-marketplace" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  10 -- Template Marketplace
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    The Template Marketplace is where experienced ACE rule
                    builders publish verified rule sets and other users purchase
                    them. Think of it as a library of battle-tested MEV
                    protection configurations that you can buy, load into your
                    forge, customize, and deploy -- all without building from
                    scratch.
                  </p>
                  <p>
                    Templates are priced in{" "}
                    <span className="text-forge-orange font-mono">$KAZT</span>{" "}
                    tokens. The standard fee split is{" "}
                    <strong className="text-text-primary">
                      95% to the seller, 5% to the protocol treasury
                    </strong>
                    . Whale tier sellers enjoy a reduced protocol fee of{" "}
                    <strong className="text-text-primary">2.5%</strong>,
                    receiving 97.5% of each sale. This incentivizes experienced
                    builders to create and maintain high-quality templates.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="pixel-border bg-bg-card/30 p-4">
                      <p className="font-display text-[8px] text-forge-orange uppercase tracking-wider mb-2">
                        For Buyers
                      </p>
                      <div className="space-y-2 text-xs text-text-secondary">
                        <p>
                          Browse verified templates with descriptions, block
                          counts, preview visualizations, and seller reputation
                          scores. Each template shows which block types are
                          included and what parameters are pre-configured.
                        </p>
                        <p>
                          After purchase, the template loads directly into your
                          forge canvas. All blocks, connections, and parameters
                          are pre-set. You can use the template as-is or
                          customize any parameter to fit your protocol&apos;s
                          specific needs.
                        </p>
                      </div>
                    </div>
                    <div className="pixel-border bg-bg-card/30 p-4">
                      <p className="font-display text-[8px] text-molten-gold uppercase tracking-wider mb-2">
                        For Sellers
                      </p>
                      <div className="space-y-2 text-xs text-text-secondary">
                        <p>
                          Build, test, and publish your rule configurations to
                          earn $KAZT from every sale. To publish, your template
                          must pass validation with zero errors and include at
                          least one successful simulation run.
                        </p>
                        <p>
                          Set your own price in $KAZT. Provide a clear
                          description, use-case tags, and recommended protocol
                          types. Templates with more sales and positive ratings
                          rank higher in marketplace search results.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      How to Publish a Template
                    </p>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          01.
                        </span>
                        <span>
                          Build your rule set in the forge. Ensure it passes
                          validation with zero errors.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          02.
                        </span>
                        <span>
                          Run at least one successful simulation. The simulation
                          results are included with your template listing.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          03.
                        </span>
                        <span>
                          Click &quot;Publish to Marketplace&quot; in the export
                          menu. Set your price, write a description, and add
                          use-case tags.
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-forge-orange font-mono flex-shrink-0 w-6">
                          04.
                        </span>
                        <span>
                          Your template goes through a brief automated review
                          (parameter sanity checks, block count verification).
                          Once approved, it appears in the marketplace.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pixel-border bg-bg-card/30 p-4">
                    <p className="font-display text-[8px] text-text-muted uppercase tracking-wider mb-3">
                      Seed Templates
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        {
                          name: "DEX AMM Protection Pack",
                          desc: "FIFO ordering + 200ms batching for AMM pools",
                        },
                        {
                          name: "Lending Protocol Guard",
                          desc: "Priority by stake + liquidation size filter",
                        },
                        {
                          name: "Orderbook Fairness Pack",
                          desc: "Price-time ordering + CLOB matching engine",
                        },
                        {
                          name: "NFT Mint Guard",
                          desc: "Whitelist filter + pro-rata ordering for fair mints",
                        },
                        {
                          name: "Perpetuals MEV Shield",
                          desc: "Batch + filter + priority for perp exchanges",
                        },
                        {
                          name: "Staking Reward Sequencer",
                          desc: "FIFO ordering + min batch for reward distribution",
                        },
                        {
                          name: "Bridge Transaction Shield",
                          desc: "Filter + priority by token hold for cross-chain",
                        },
                        {
                          name: "DAO Governance Pack",
                          desc: "Pro-rata ordering + stake-weighted priority for voting",
                        },
                      ].map((template) => (
                        <div
                          key={template.name}
                          className="text-xs text-text-secondary flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-forge-orange flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-text-primary">
                              {template.name}
                            </span>
                            <span className="text-text-muted">
                              {" "}
                              -- {template.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ================================================ */}
              {/* 11 -- Architecture                                */}
              {/* ================================================ */}
              <section id="architecture" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  11 -- Architecture
                </h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    This section is for technically curious users who want to
                    understand how Kazt is built under the hood. Kazt follows a
                    standard modern web architecture with a Next.js frontend, a
                    FastAPI backend, and integrations with Solana infrastructure.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="pixel-border bg-bg-card/30 p-4">
                      <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-2">
                        Frontend
                      </p>
                      <ul className="space-y-1.5 text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              Next.js 14
                            </strong>{" "}
                            -- App Router, server components, API routes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              Tailwind CSS
                            </strong>{" "}
                            -- Utility-first styling with custom pixel-art theme
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              React Flow
                            </strong>{" "}
                            -- Node-based graph editor for the rule canvas
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              Three.js
                            </strong>{" "}
                            -- 3D scenes for landing page and visual effects
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              Deployed on Vercel
                            </strong>{" "}
                            -- Edge network, automatic CI/CD from Git
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="pixel-border bg-bg-card/30 p-4">
                      <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-2">
                        Backend
                      </p>
                      <ul className="space-y-1.5 text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              FastAPI (Python)
                            </strong>{" "}
                            -- Async REST API, auto-generated OpenAPI docs
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              PostgreSQL
                            </strong>{" "}
                            -- Primary database for rules, users, templates
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">Redis</strong>{" "}
                            -- Caching tier levels, rate limiting, session data
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                          <span>
                            <strong className="text-text-primary">
                              Deployed on Railway
                            </strong>{" "}
                            -- Managed infrastructure with auto-scaling
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pixel-border bg-bg-card/30 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-2">
                      Blockchain Integrations
                    </p>
                    <ul className="space-y-1.5 text-xs text-text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                        <span>
                          <strong className="text-text-primary">
                            Helius RPC
                          </strong>{" "}
                          -- High-performance Solana RPC node for on-chain reads
                          (token balances, transaction history)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                        <span>
                          <strong className="text-text-primary">
                            Jito BAM SDK
                          </strong>{" "}
                          -- Official SDK for publishing ACE rules to the Block
                          Auction Marketplace
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-forge-orange flex-shrink-0 mt-1.5" />
                        <span>
                          <strong className="text-text-primary">
                            Anchor Framework
                          </strong>{" "}
                          -- Code generation target for on-chain ACE rule
                          programs
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-forge-orange uppercase tracking-wider mb-3">
                      System Flow Diagram
                    </p>
                    <pre className="text-[10px] sm:text-xs font-mono text-text-secondary overflow-x-auto leading-relaxed whitespace-pre">
{`+----------+    +----------+    +-----------+
|          |    |          |    |           |
|  User    +--->+  Web App +--->+  Rule     |
| (Browser)|    | (Next.js)|    |  Canvas   |
|          |    |          |    | (React    |
+----------+    +-----+----+    |  Flow)    |
                      |         +-----+-----+
                      |               |
                +-----v----+   +------v------+
                |          |   |             |
                | FastAPI  |   | Validator   |
                | Backend  |   | (conflict   |
                | (Python) |   |  detection) |
                |          |   |             |
                +-----+----+   +------+------+
                      |               |
                +-----v----+   +------v------+
                |          |   |             |
                | Postgres |   | Simulator   |
                | + Redis  |   | (test txns) |
                |          |   |             |
                +----------+   +------+------+
                                      |
                               +------v------+
                               |             |
                               | Exporter    |
                               | (JSON /     |
                               |  Anchor)    |
                               +------+------+
                                      |
                               +------v------+
                               |             |
                               | Jito BAM    |
                               | (on-chain   |
                               |  deploy)    |
                               +-------------+`}
                    </pre>
                  </div>

                  <div className="pixel-border bg-bg-card/50 p-4">
                    <p className="font-display text-[9px] text-text-muted uppercase tracking-wider mb-2">
                      API Endpoints (Preview)
                    </p>
                    <div className="space-y-1 text-[10px] font-mono text-text-secondary">
                      <p>
                        <span className="text-emerald-400">POST</span>{" "}
                        <span className="text-text-muted">
                          /api/v1/rules/create
                        </span>{" "}
                        -- Create a new rule set
                      </p>
                      <p>
                        <span className="text-blue-400">GET</span>{"  "}
                        <span className="text-text-muted">
                          /api/v1/rules/{"{id}"}
                        </span>{" "}
                        -- Retrieve a rule set by ID
                      </p>
                      <p>
                        <span className="text-amber-400">POST</span>{" "}
                        <span className="text-text-muted">
                          /api/v1/simulate
                        </span>{" "}
                        -- Run a simulation against a rule set
                      </p>
                      <p>
                        <span className="text-amber-400">POST</span>{" "}
                        <span className="text-text-muted">
                          /api/v1/export/json
                        </span>{" "}
                        -- Export rule set as JSON
                      </p>
                      <p>
                        <span className="text-amber-400">POST</span>{" "}
                        <span className="text-text-muted">
                          /api/v1/export/anchor
                        </span>{" "}
                        -- Export rule set as Anchor IDL
                      </p>
                      <p>
                        <span className="text-blue-400">GET</span>{"  "}
                        <span className="text-text-muted">
                          /api/v1/marketplace
                        </span>{" "}
                        -- Browse marketplace templates
                      </p>
                      <p>
                        <span className="text-amber-400">POST</span>{" "}
                        <span className="text-text-muted">
                          /api/v1/marketplace/publish
                        </span>{" "}
                        -- Publish a template
                      </p>
                      <p>
                        <span className="text-blue-400">GET</span>{"  "}
                        <span className="text-text-muted">
                          /api/v1/user/tier
                        </span>{" "}
                        -- Check current user tier level
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================================================ */}
              {/* 12 -- FAQ                                         */}
              {/* ================================================ */}
              <section id="faq" className="mb-14 scroll-mt-24">
                <h2 className="font-display text-sm sm:text-base text-text-primary uppercase tracking-wider mb-5 pb-2 border-b-2 border-wire-border">
                  12 -- FAQ
                </h2>
                <div className="space-y-4">
                  {FAQ_ITEMS.map((item) => (
                    <div
                      key={item.q}
                      className="pixel-border bg-bg-card/30 p-4"
                    >
                      <h3 className="font-display text-[10px] text-text-primary uppercase tracking-wider mb-2">
                        {item.q}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-6 pb-10 border-t-2 border-wire-border">
                <p className="font-mono text-[10px] text-text-muted text-center tracking-wider">
                  Pour your rules. Set them in chain.
                </p>
              </div>
            </div>
          </div>

          {/* Right sidebar TOC */}
          <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 border-l border-wire-border bg-bg-card/20 h-full overflow-y-auto">
            <div className="px-5 py-10">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-4">
                On this page
              </p>
              <nav className="space-y-0.5">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`block w-full text-left text-[11px] py-1.5 pl-3 transition-colors border-l-2 ${
                      activeSection === s.id
                        ? "text-forge-orange border-forge-orange bg-forge-orange/5"
                        : "border-transparent text-text-muted hover:text-text-secondary hover:border-wire-border"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
              <a
                href="/forge"
                className="block text-center mt-8 px-4 py-2 pixel-border-orange bg-forge-orange/10 text-forge-orange font-display text-[9px] uppercase tracking-wider hover:bg-forge-orange/20 transition-colors"
              >
                Open Forge
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

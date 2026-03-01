import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  {
    label: "Twitter",
    href: "https://x.com/usekazt",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/usekazt",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
      </svg>
    ),
  },
  {
    label: "Docs",
    href: "/docs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
];

const NAV_LINKS = [
  { href: "/forge", label: "Forge" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
  { href: "/app", label: "App" },
  { href: "#token", label: "$KAZT" },
];

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-wire-border bg-bg-elevated overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-50" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 group mb-3">
              <div className="relative w-6 h-6">
                <Image src="/images/logo.png" alt="Kazt" fill className="object-contain pixel-render" sizes="24px" />
              </div>
              <span className="font-display text-xs tracking-wider text-forge-orange group-hover:text-forge-orange-light transition-colors">
                KAZT
              </span>
            </Link>
            <p className="text-[10px] text-text-muted leading-relaxed max-w-[200px]">
              The first visual ACE rule builder on Solana. Forge your on-chain protection.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-display text-[9px] text-text-muted uppercase tracking-wider mb-3">Navigate</h4>
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[11px] text-text-secondary hover:text-forge-orange transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-[9px] text-text-muted uppercase tracking-wider mb-3">Community</h4>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="p-2 pixel-border text-text-muted hover:text-forge-orange hover:border-forge-orange/30 transition-all"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 mb-4 h-px bg-gradient-to-r from-transparent via-wire-border to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-text-muted text-[10px]">
            &copy; {new Date().getFullYear()} Kazt Protocol. All rights reserved.
          </p>

          {/* Pixel decoration */}
          <div className="flex gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1"
                style={{
                  background: i % 3 === 0 ? "var(--color-forge-orange)" : "var(--color-wire-border)",
                  opacity: i % 3 === 0 ? 0.4 : 0.15,
                }}
              />
            ))}
          </div>

          <p className="font-mono text-text-muted text-[9px]">
            Built on Solana
          </p>
        </div>
      </div>
    </footer>
  );
}

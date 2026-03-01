"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { features } from "@/lib/features";

const NAV_LINKS = [
  { href: "/forge", label: "Forge", enabled: features.forge },
  { href: "/templates", label: "Templates", enabled: features.templates },
  { href: "/docs", label: "Docs", enabled: true },
  { href: "/app", label: "App", enabled: true },
].filter((link) => link.enabled);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b-2 border-wire-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-6 h-6">
              <Image
                src="/images/logo.png"
                alt="Kazt"
                fill
                className="object-contain pixel-render"
                sizes="24px"
              />
            </div>
            <span className="font-display text-xs tracking-wider text-forge-orange group-hover:text-forge-orange-light transition-colors">
              KAZT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 font-mono text-xs text-text-secondary hover:text-forge-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Social links */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://x.com/usekazt"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/usekazt/kazt"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label="GitHub"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            {features.showConnect && (
              <button className="hidden sm:block juice-btn px-4 py-1.5 font-display uppercase text-[10px] tracking-wider text-bg bg-forge-orange hover:bg-forge-orange-light transition-colors">
                Connect
              </button>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M4 4l10 10M4 14L14 4" />
                ) : (
                  <path d="M3 5h12M3 9h12M3 13h12" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-wire-border bg-bg/95 backdrop-blur-md">
            <nav className="flex flex-col py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 font-mono text-xs text-text-secondary hover:text-forge-orange transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 px-4 pt-3 border-t border-wire-border mt-2">
                <a
                  href="https://x.com/usekazt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/usekazt/kazt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
              {features.showConnect && (
                <div className="px-4 pt-2">
                  <button className="w-full juice-btn px-4 py-2 font-display uppercase text-[10px] tracking-wider text-bg bg-forge-orange hover:bg-forge-orange-light transition-colors">
                    Connect Wallet
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

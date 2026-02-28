"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { features } from "@/lib/features";

const NAV_LINKS = [
  { href: "/forge", label: "Forge", enabled: features.forge },
  { href: "/templates", label: "Templates", enabled: features.templates },
  { href: "/docs", label: "Docs", enabled: true },
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

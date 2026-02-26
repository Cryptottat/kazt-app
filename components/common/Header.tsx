"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { features } from "@/lib/features";

// 피처 플래그에 따라 필터링되는 네비게이션 링크
const NAV_LINKS = [
  { href: "/forge", label: "Forge", enabled: features.forge },
  { href: "/templates", label: "Templates", enabled: features.templates },
  { href: "/docs", label: "Docs", enabled: true },
].filter((link) => link.enabled);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-wire-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="font-display text-2xl font-bold tracking-wider text-forge-orange transition-all group-hover:text-forge-orange-light">
                KAZT
              </span>
              <div className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-forge-orange group-hover:w-full transition-all duration-300" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group"
              >
                {link.label}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-forge-orange group-hover:w-[60%] transition-all duration-200" />
              </Link>
            ))}
          </nav>

          {/* Connect Wallet + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {features.showConnect && (
              <button className="hidden sm:block cursor-hammer px-4 py-2 text-sm font-display uppercase tracking-wider border border-forge-orange text-forge-orange rounded hover:bg-forge-orange hover:text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Connect Wallet
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {mobileMenuOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-wire-border bg-bg/95 backdrop-blur-xl">
            <nav className="flex flex-col py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {features.showConnect && (
                <div className="px-4 pt-3">
                  <button className="w-full cursor-hammer px-4 py-2 text-sm font-display uppercase tracking-wider border border-forge-orange text-forge-orange rounded hover:bg-forge-orange hover:text-white transition-all">
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

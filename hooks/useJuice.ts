"use client";

import { useCallback, useRef } from "react";

const EMBER_COLORS = [
  "#F97316", // forge-orange
  "#FB923C", // forge-orange-light
  "#F59E0B", // molten-gold
  "#FBBF24", // molten-gold-light
  "#EF4444", // crack-red (rare hot spark)
];

/**
 * useJuice — Hardcore blacksmith "game feel" hook.
 *
 * Provides:
 * - triggerHit(e)   → screen shake + ember burst at click point + cursor hit anim + hit-stop
 * - triggerShake()  → screen shake only
 * - triggerEmbers(x, y, count?) → spawn ember particles at coordinates
 *
 * Usage:
 *   const { triggerHit, juiceProps } = useJuice();
 *   <button {...juiceProps} className="juice-btn ...">Click me</button>
 */
export function useJuice() {
  const shakeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cursorTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Shake the screen */
  const triggerShake = useCallback((duration = 300) => {
    if (typeof document === "undefined") return;
    document.body.classList.remove("shaking");
    // Force reflow to restart animation
    void document.body.offsetWidth;
    document.body.classList.add("shaking");
    clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => {
      document.body.classList.remove("shaking");
    }, duration);
  }, []);

  /** Spawn ember particles at (x, y) */
  const triggerEmbers = useCallback((x: number, y: number, count = 10) => {
    if (typeof document === "undefined") return;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "ember-particle";

      const size = 2 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 40;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed - 10; // bias upward

      el.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)]};
        --tx: ${tx}px;
        --ty: ${ty}px;
      `;

      frag.appendChild(el);

      // Self-cleanup
      setTimeout(() => el.remove(), 600);
    }

    document.body.appendChild(frag);
  }, []);

  /** Cursor hit animation */
  const triggerCursorHit = useCallback(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add("cursor-hit");
    clearTimeout(cursorTimer.current);
    cursorTimer.current = setTimeout(() => {
      document.body.classList.remove("cursor-hit");
    }, 150);
  }, []);

  /** Full hammer hit: shake + embers + cursor + hit-stop */
  const triggerHit = useCallback(
    (e: React.MouseEvent | { clientX: number; clientY: number }) => {
      triggerCursorHit();
      triggerShake(250);
      triggerEmbers(e.clientX, e.clientY, 12);
    },
    [triggerCursorHit, triggerShake, triggerEmbers]
  );

  /** Convenience props to spread onto a clickable element */
  const juiceProps = {
    onMouseDown: (e: React.MouseEvent) => {
      triggerHit(e);
    },
  };

  return { triggerHit, triggerShake, triggerEmbers, triggerCursorHit, juiceProps };
}

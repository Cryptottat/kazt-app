"use client";

import { useRef, useEffect, useCallback } from "react";

const POOL_SIZE = 14;
const THROTTLE_MS = 50;
const COLORS = ["#F97316", "#F59E0B"]; // forge-orange, molten-gold

export default function MouseSparks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const lastTimeRef = useRef(0);

  const handleMove = useCallback((e: MouseEvent) => {
    const now = performance.now();
    if (now - lastTimeRef.current < THROTTLE_MS) return;
    lastTimeRef.current = now;

    const container = containerRef.current;
    if (!container) return;

    const spark = container.children[indexRef.current % POOL_SIZE] as HTMLElement;
    if (!spark) return;

    // Position at cursor
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    spark.style.background = COLORS[Math.random() > 0.5 ? 0 : 1];

    // Restart animation by removing and re-adding class
    spark.classList.remove("spark-active");
    // Force reflow
    void spark.offsetWidth;
    spark.classList.add("spark-active");

    indexRef.current++;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full opacity-0"
          style={{
            willChange: "transform, opacity",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

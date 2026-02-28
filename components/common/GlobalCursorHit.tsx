"use client";

import { useEffect } from "react";

/**
 * Global mousedown handler that swaps the cursor to the "hit" state.
 * Renders nothing — just attaches listeners.
 */
export default function GlobalCursorHit() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const onDown = () => {
      document.body.classList.add("cursor-hit");
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.body.classList.remove("cursor-hit");
      }, 150);
    };

    window.addEventListener("mousedown", onDown, { passive: true });
    return () => {
      window.removeEventListener("mousedown", onDown);
      clearTimeout(timer);
    };
  }, []);

  return null;
}

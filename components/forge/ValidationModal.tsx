"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ValidationResult = {
  passed: boolean;
  conflicts: string[];
};

interface ValidationModalProps {
  result: ValidationResult | null;
  onClose: () => void;
}

export default function ValidationModal({ result, onClose }: ValidationModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [result, onClose]);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === backdropRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="pixel-border bg-bg-elevated w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className={`px-5 py-3 border-b-2 ${
              result.passed ? "border-cast-green/30 bg-cast-green/5" : "border-crack-red/30 bg-crack-red/5"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`font-display text-xs tracking-wider uppercase ${
                  result.passed ? "text-cast-green" : "text-crack-red"
                }`}>
                  {result.passed ? "Validation Passed" : "Validation Failed"}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              {result.passed ? (
                <p className="text-sm text-text-secondary font-mono">
                  No conflicts detected. Your rule configuration is valid.
                </p>
              ) : (
                <div>
                  <p className="text-xs text-text-muted font-mono mb-3">
                    Found {result.conflicts.length} issue{result.conflicts.length !== 1 ? "s" : ""}:
                  </p>
                  <ul className="space-y-1.5">
                    {result.conflicts.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-mono">
                        <span className="text-crack-red mt-0.5 flex-shrink-0">*</span>
                        <span className="text-text-secondary">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-wire-border flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-1.5 text-xs font-display uppercase tracking-wider pixel-border text-text-primary hover:border-forge-orange hover:text-forge-orange transition-colors bg-bg/40"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

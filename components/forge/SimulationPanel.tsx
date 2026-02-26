"use client";

import { useForgeStore } from "@/lib/store";

interface SimResult {
  tx_id: string;
  outcome: "included" | "filtered" | "batched" | "rejected";
  position?: number;
  batch_id?: number;
  reason?: string;
}

const OUTCOME_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  included: {
    label: "INCLUDED",
    color: "text-cast-green",
    bg: "bg-cast-green/10",
  },
  filtered: {
    label: "FILTERED",
    color: "text-molten-gold",
    bg: "bg-molten-gold/10",
  },
  batched: {
    label: "BATCHED",
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
  },
  rejected: {
    label: "REJECTED",
    color: "text-crack-red",
    bg: "bg-crack-red/10",
  },
};

export default function SimulationPanel() {
  const { simulationResults, isSimulating } = useForgeStore();

  const results = (simulationResults as { results?: SimResult[] })?.results;

  if (isSimulating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="relative w-8 h-8 mb-3">
          <div className="absolute inset-0 border-2 border-wire-border rounded-full" />
          <div className="absolute inset-0 border-2 border-forge-orange rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-text-muted text-xs">Running simulation...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-text-muted text-3xl mb-3">⚡</div>
        <p className="text-text-muted text-sm">
          Run a simulation to see transaction outcomes here.
        </p>
      </div>
    );
  }

  // Summary
  const summary = results.reduce(
    (acc, r) => {
      acc[r.outcome] = (acc[r.outcome] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Summary bar */}
      <div className="px-4 py-3 border-b border-wire-border">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary mb-2">
          Simulation Results
        </h3>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(summary).map(([outcome, count]) => {
            const config = OUTCOME_CONFIG[outcome];
            return (
              <div
                key={outcome}
                className={`px-2 py-1 rounded text-[10px] font-mono ${config?.color} ${config?.bg}`}
              >
                {config?.label}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {results.map((result, i) => {
          const config = OUTCOME_CONFIG[result.outcome];
          return (
            <div
              key={result.tx_id || i}
              className="px-4 py-2.5 border-b border-wire-border hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-text-muted font-mono truncate max-w-[120px]">
                  {result.tx_id}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold ${config?.color}`}
                >
                  {config?.label}
                </span>
              </div>
              {result.position !== undefined && (
                <div className="text-[10px] text-text-muted">
                  Position: {result.position}
                </div>
              )}
              {result.batch_id !== undefined && (
                <div className="text-[10px] text-text-muted">
                  Batch: #{result.batch_id}
                </div>
              )}
              {result.reason && (
                <div className="text-[10px] text-text-muted mt-0.5 italic">
                  {result.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

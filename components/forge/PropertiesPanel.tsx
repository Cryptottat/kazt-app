"use client";

import { useForgeStore } from "@/lib/store";

const DEFAULT_PARAMS: Record<string, Record<string, unknown>> = {
  ordering: { method: "FIFO", tiebreaker: "timestamp" },
  batching: { interval_ms: 1000, max_batch: 50, min_batch: 1 },
  matching: { engine: "clob", partial_fill: true },
  priority: { factor: "stake", weight: 1.0 },
  filter: { blacklist: "", whitelist: "", max_size: 1000, min_size: 0 },
};

const SELECT_OPTIONS: Record<string, string[]> = {
  method: ["FIFO", "price_time", "pro_rata"],
  tiebreaker: ["fee_amount", "timestamp", "stake"],
  engine: ["clob", "amm", "rfq"],
  factor: ["stake", "fee", "token_hold", "custom"],
};

export default function PropertiesPanel() {
  const { blocks, selectedBlock, updateBlock, removeBlock, selectBlock } =
    useForgeStore();

  const block = blocks.find((b) => b.id === selectedBlock);

  if (!block) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="text-text-muted text-3xl mb-3">⚙</div>
        <p className="text-text-muted text-sm">
          Select a block on the canvas to edit its properties.
        </p>
      </div>
    );
  }

  const params = { ...DEFAULT_PARAMS[block.type], ...block.params };

  const handleParamChange = (key: string, value: unknown) => {
    const newParams = { ...block.params, [key]: value };
    updateBlock(block.id, { params: newParams });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-wire-border flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
            Properties
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5 font-mono">
            {block.id}
          </p>
        </div>
        <button
          onClick={() => {
            removeBlock(block.id);
            selectBlock(null);
          }}
          className="p-1.5 text-text-muted hover:text-crack-red transition-colors cursor-hammer"
          aria-label="Delete block"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Block type label */}
      <div className="px-4 py-3 border-b border-wire-border">
        <span className="text-xs font-display uppercase tracking-wider text-forge-orange">
          {block.type}
        </span>
      </div>

      {/* Parameters */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {Object.entries(params).map(([key, value]) => {
          const selectOpts = SELECT_OPTIONS[key];

          return (
            <div key={key}>
              <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">
                {key.replace(/_/g, " ")}
              </label>
              {selectOpts ? (
                <select
                  value={String(value)}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="w-full bg-bg border border-wire-border px-2 py-1.5 text-xs text-text-primary font-mono focus:border-forge-orange focus:outline-none transition-colors"
                >
                  {selectOpts.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : typeof value === "boolean" ? (
                <button
                  onClick={() => handleParamChange(key, !value)}
                  className={`px-3 py-1.5 text-xs border transition-colors font-mono ${
                    value
                      ? "border-cast-green text-cast-green bg-cast-green/10"
                      : "border-wire-border text-text-muted"
                  }`}
                >
                  {value ? "true" : "false"}
                </button>
              ) : typeof value === "number" ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handleParamChange(key, parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-bg border border-wire-border px-2 py-1.5 text-xs text-text-primary font-mono focus:border-forge-orange focus:outline-none transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="w-full bg-bg border border-wire-border px-2 py-1.5 text-xs text-text-primary font-mono focus:border-forge-orange focus:outline-none transition-colors"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Connections info */}
      <div className="px-4 py-3 border-t border-wire-border">
        <h4 className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Connections
        </h4>
        <p className="text-xs text-text-secondary font-mono">
          {block.connections.length > 0
            ? block.connections.join(", ")
            : "No connections"}
        </p>
      </div>
    </div>
  );
}

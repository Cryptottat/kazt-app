"use client";

import type { RuleBlockType } from "./RuleBlockNode";

interface BlockPaletteProps {
  onAddBlock: (type: RuleBlockType) => void;
}

const BLOCK_TYPES: {
  type: RuleBlockType;
  label: string;
  description: string;
  color: string;
  icon: string;
}[] = [
  {
    type: "ordering",
    label: "Ordering",
    description: "FIFO, price-time, pro-rata",
    color: "#F97316",
    icon: "↕",
  },
  {
    type: "batching",
    label: "Batching",
    description: "Interval, batch size",
    color: "#F59E0B",
    icon: "▦",
  },
  {
    type: "matching",
    label: "Matching",
    description: "CLOB, AMM, RFQ",
    color: "#10B981",
    icon: "⇌",
  },
  {
    type: "priority",
    label: "Priority",
    description: "Stake, fee, token hold",
    color: "#3B82F6",
    icon: "★",
  },
  {
    type: "filter",
    label: "Filter",
    description: "Blacklist, whitelist, size",
    color: "#EF4444",
    icon: "⊘",
  },
];

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {BLOCK_TYPES.map((block) => (
        <button
          key={block.type}
          onClick={() => onAddBlock(block.type)}
          className="group flex items-center gap-3 w-full text-left px-3 py-2.5 bg-bg-card pixel-border hover:border-wire-border-hover transition-all duration-200 cursor-hammer"
          style={{
            borderLeftWidth: "3px",
            borderLeftColor: block.color,
          }}
        >
          <span
            className="text-lg flex-shrink-0"
            style={{ color: block.color }}
          >
            {block.icon}
          </span>
          <div className="min-w-0">
            <div
              className="text-xs font-display uppercase tracking-wider font-bold"
              style={{ color: block.color }}
            >
              {block.label}
            </div>
            <div className="text-[10px] text-text-muted truncate">
              {block.description}
            </div>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="ml-auto flex-shrink-0 text-text-muted group-hover:text-text-secondary transition-colors"
          >
            <path
              d="M7 3v8M3 7h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

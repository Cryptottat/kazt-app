"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

export type RuleBlockType =
  | "ordering"
  | "batching"
  | "matching"
  | "priority"
  | "filter";

export interface RuleBlockNodeData {
  label: string;
  blockType: RuleBlockType;
  params: Record<string, unknown>;
  [key: string]: unknown;
}

type RuleBlockNode = Node<RuleBlockNodeData, "ruleBlock">;

const TYPE_CONFIG: Record<
  RuleBlockType,
  { color: string; borderColor: string; icon: string; bgGlow: string }
> = {
  ordering: {
    color: "#F97316",
    borderColor: "border-t-[#F97316]",
    icon: "↕",
    bgGlow: "rgba(249,115,22,0.06)",
  },
  batching: {
    color: "#F59E0B",
    borderColor: "border-t-[#F59E0B]",
    icon: "▦",
    bgGlow: "rgba(245,158,11,0.06)",
  },
  matching: {
    color: "#10B981",
    borderColor: "border-t-[#10B981]",
    icon: "⇌",
    bgGlow: "rgba(16,185,129,0.06)",
  },
  priority: {
    color: "#3B82F6",
    borderColor: "border-t-[#3B82F6]",
    icon: "★",
    bgGlow: "rgba(59,130,246,0.06)",
  },
  filter: {
    color: "#EF4444",
    borderColor: "border-t-[#EF4444]",
    icon: "⊘",
    bgGlow: "rgba(239,68,68,0.06)",
  },
};

function RuleBlockNodeComponent({ data, selected }: NodeProps<RuleBlockNode>) {
  const config = TYPE_CONFIG[data.blockType] || TYPE_CONFIG.ordering;

  // Build summary of main params
  const paramEntries = Object.entries(data.params || {}).slice(0, 3);

  return (
    <div
      className={`relative min-w-[180px] max-w-[220px] border-2 border-wire-border border-t-2 ${config.borderColor} transition-all duration-200 ${
        selected
          ? "shadow-[0_0_20px_rgba(249,115,22,0.2)] border-wire-border-hover"
          : "hover:border-wire-border-hover"
      }`}
      style={{
        background: `linear-gradient(to bottom, ${config.bgGlow}, #242830)`,
        boxShadow: selected
          ? "0 0 20px rgba(249,115,22,0.2), inset 2px 2px 0 rgba(255,255,255,0.03), inset -2px -2px 0 rgba(0,0,0,0.3)"
          : "inset 2px 2px 0 rgba(255,255,255,0.03), inset -2px -2px 0 rgba(0,0,0,0.3)",
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-wire-border-hover !bg-bg-card"
        style={{ top: -6 }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-wire-border">
        <span className="text-base" style={{ color: config.color }}>
          {config.icon}
        </span>
        <span
          className="text-xs font-display uppercase tracking-wider font-bold"
          style={{ color: config.color }}
        >
          {data.blockType}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        <div className="text-xs text-text-primary font-medium mb-1">
          {data.label}
        </div>
        {paramEntries.length > 0 && (
          <div className="space-y-0.5">
            {paramEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between text-[10px]">
                <span className="text-text-muted">{key}:</span>
                <span className="text-text-secondary font-mono">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-wire-border-hover !bg-bg-card"
        style={{ bottom: -6 }}
      />
    </div>
  );
}

export default memo(RuleBlockNodeComponent);

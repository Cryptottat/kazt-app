"use client";

import { useCallback, useState, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Header from "@/components/common/Header";
import RuleBlockNode from "@/components/forge/RuleBlockNode";
import type { RuleBlockType, RuleBlockNodeData } from "@/components/forge/RuleBlockNode";
import BlockPalette from "@/components/forge/BlockPalette";
import PropertiesPanel from "@/components/forge/PropertiesPanel";
import SimulationPanel from "@/components/forge/SimulationPanel";
import ValidationModal from "@/components/forge/ValidationModal";
import { useForgeStore } from "@/lib/store";
import { features } from "@/lib/features";

const DEFAULT_PARAMS: Record<RuleBlockType, Record<string, unknown>> = {
  ordering: { method: "FIFO", tiebreaker: "timestamp" },
  batching: { interval_ms: 1000, max_batch: 50 },
  matching: { engine: "clob", partial_fill: true },
  priority: { factor: "stake", weight: 1.0 },
  filter: { blacklist: "", whitelist: "", max_size: 1000 },
};

let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `block_${Date.now()}_${idCounter}`;
}

export default function ForgePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<RuleBlockNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rightPanel, setRightPanel] = useState<"properties" | "simulation">(
    "properties"
  );
  const [validationResult, setValidationResult] = useState<{
    passed: boolean;
    conflicts: string[];
  } | null>(null);

  const {
    addBlock,
    removeBlock,
    selectBlock,
    selectedBlock,
    blocks,
    setSimulationResults,
    setIsSimulating,
    isSimulating,
    simulationResults,
  } = useForgeStore();

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      ruleBlock: RuleBlockNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#F97316", strokeWidth: 2 } }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectBlock(node.id);
      setRightPanel("properties");
    },
    [selectBlock]
  );

  const onPaneClick = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  const handleAddBlock = useCallback(
    (type: RuleBlockType) => {
      const id = generateId();
      const params = DEFAULT_PARAMS[type];
      const position = {
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 300,
      };

      // Add to zustand store
      addBlock({
        id,
        type,
        params,
        position,
        connections: [],
      });

      // Add to React Flow
      const newNode: Node<RuleBlockNodeData> = {
        id,
        type: "ruleBlock",
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Rule`,
          blockType: type,
          params,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [addBlock, setNodes]
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      removeBlock(id);
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (selectedBlock === id) selectBlock(null);
    },
    [removeBlock, selectedBlock, selectBlock, setNodes, setEdges]
  );

  const handleValidate = useCallback(() => {
    // Simple validation: check for orphan nodes, duplicate types
    const conflicts: string[] = [];
    const typeCount: Record<string, number> = {};
    const connectedNodeIds = new Set<string>();

    edges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });

    nodes.forEach((n) => {
      const data = n.data as RuleBlockNodeData;
      typeCount[data.blockType] = (typeCount[data.blockType] || 0) + 1;
      if (nodes.length > 1 && !connectedNodeIds.has(n.id)) {
        conflicts.push(`Block "${n.id}" is not connected`);
      }
    });

    Object.entries(typeCount).forEach(([type, count]) => {
      if (type === "ordering" && count > 1) {
        conflicts.push("Multiple ordering blocks may conflict");
      }
      if (type === "matching" && count > 1) {
        conflicts.push("Multiple matching blocks may conflict");
      }
    });

    setValidationResult({
      passed: conflicts.length === 0,
      conflicts,
    });
  }, [nodes, edges]);

  const handleSimulate = useCallback(() => {
    if (nodes.length === 0) {
      setValidationResult({
        passed: false,
        conflicts: ["Add at least one rule block before simulating."],
      });
      return;
    }

    setIsSimulating(true);
    setRightPanel("simulation");

    // Mock simulation
    setTimeout(() => {
      const mockResults = Array.from({ length: 20 }, (_, i) => {
        const outcomes = ["included", "filtered", "batched", "rejected"] as const;
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        return {
          tx_id: `tx_${(i + 1).toString().padStart(3, "0")}`,
          outcome,
          position: outcome === "included" ? i + 1 : undefined,
          batch_id: outcome === "batched" ? Math.floor(i / 5) + 1 : undefined,
          reason:
            outcome === "rejected"
              ? "Exceeded max_size filter"
              : outcome === "filtered"
              ? "Blacklisted address"
              : undefined,
        };
      });

      setSimulationResults({ results: mockResults });
      setIsSimulating(false);
    }, 1500);
  }, [nodes, setIsSimulating, setSimulationResults]);

  const handleExportJSON = useCallback(() => {
    const data = {
      blocks: nodes.map((n) => ({
        id: n.id,
        type: (n.data as RuleBlockNodeData).blockType,
        params: (n.data as RuleBlockNodeData).params,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        source: e.source,
        target: e.target,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kazt-rules.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Status bar stats
  const blockCount = nodes.length;
  const simResults = simulationResults as { results?: unknown[] } | null;
  const simCount = simResults?.results?.length ?? 0;

  // Phase 2: forge 비활성 시 커밍순 화면 표시
  if (!features.forge) {
    return (
      <div className="h-screen flex flex-col bg-bg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 mt-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wider text-text-primary">
            Rule Forge
          </h1>
          <p className="mt-4 text-text-secondary text-lg max-w-md">
            The anvil is still cold. The forge is being prepared for the first pour.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="/"
              className="px-8 py-3 pixel-border-orange text-forge-orange font-display uppercase tracking-wider text-sm hover:bg-forge-orange/10 transition-all duration-200"
            >
              Back to Home
            </a>
            <p className="text-xs text-text-muted font-mono">
              * 100% of deployment fees will be burned.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-bg">
      <Header />

      {/* Action bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-wire-border bg-bg-elevated mt-16">
        <div className="flex items-center gap-2 mr-auto">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-forge-orange">
            Rule Forge
          </span>
          <span className="text-text-muted text-xs">|</span>
          <span className="text-text-muted text-xs font-mono">
            {blockCount} block{blockCount !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          onClick={handleValidate}
          className="px-3 py-1.5 text-xs font-display uppercase tracking-wider pixel-border text-text-secondary hover:border-cast-green hover:text-cast-green transition-colors cursor-hammer"
        >
          Validate
        </button>
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="px-3 py-1.5 text-xs font-display uppercase tracking-wider pixel-border text-text-secondary hover:border-molten-gold hover:text-molten-gold transition-colors cursor-hammer disabled:opacity-50"
        >
          {isSimulating ? "Simulating..." : "Simulate"}
        </button>
        <button
          onClick={handleExportJSON}
          className="px-3 py-1.5 text-xs font-display uppercase tracking-wider pixel-border text-text-secondary hover:border-forge-orange hover:text-forge-orange transition-colors cursor-hammer"
        >
          Export JSON
        </button>
        <button
          className={`px-3 py-1.5 text-xs font-display uppercase tracking-wider pixel-border transition-colors ${
            features.deploy
              ? "text-text-secondary hover:border-forge-orange hover:text-forge-orange cursor-hammer"
              : "text-text-muted cursor-not-allowed opacity-50"
          }`}
          disabled={!features.deploy}
          title={features.deploy ? "Export Anchor IDL" : "Pro+ only"}
        >
          Export Anchor
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar -- Block Palette */}
        <div className="w-52 flex-shrink-0 border-r border-wire-border bg-bg-elevated overflow-y-auto">
          <div className="px-3 py-3 border-b border-wire-border">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-text-secondary">
              Block Palette
            </h3>
          </div>
          <div className="p-3">
            <BlockPalette onAddBlock={handleAddBlock} />
          </div>
        </div>

        {/* Center -- React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "#F97316", strokeWidth: 2 },
            }}
            style={{ background: "#0C0E12" }}
            onNodesDelete={(deletedNodes) => {
              deletedNodes.forEach((n) => handleDeleteBlock(n.id));
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="rgba(255,255,255,0.05)"
            />
            <Controls
              style={{ background: "#242830", borderColor: "rgba(255,255,255,0.08)" }}
            />
            <MiniMap
              nodeColor={() => "#F97316"}
              maskColor="rgba(12,14,18,0.8)"
              style={{ background: "#1A1D23", borderColor: "rgba(255,255,255,0.08)" }}
            />
          </ReactFlow>
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex-shrink-0 border-l border-wire-border bg-bg-elevated flex flex-col">
          {/* Panel tabs */}
          <div className="flex border-b border-wire-border">
            <button
              onClick={() => setRightPanel("properties")}
              className={`flex-1 px-3 py-2.5 text-xs font-display uppercase tracking-wider transition-colors ${
                rightPanel === "properties"
                  ? "text-forge-orange border-b-2 border-forge-orange"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setRightPanel("simulation")}
              className={`flex-1 px-3 py-2.5 text-xs font-display uppercase tracking-wider transition-colors ${
                rightPanel === "simulation"
                  ? "text-forge-orange border-b-2 border-forge-orange"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Simulation
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {rightPanel === "properties" ? (
              <PropertiesPanel />
            ) : (
              <SimulationPanel />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 border-t border-wire-border bg-bg-elevated text-[10px] font-mono text-text-muted">
        <span>
          Blocks: <span className="text-text-secondary">{blockCount}</span>
        </span>
        <span>
          Edges: <span className="text-text-secondary">{edges.length}</span>
        </span>
        <span>
          Simulation:{" "}
          <span className="text-text-secondary">
            {simCount > 0 ? `${simCount} TX processed` : "idle"}
          </span>
        </span>
        <span className="ml-auto text-text-muted">
          Kazt Forge v0.1.0
        </span>
      </div>

      {/* Validation Modal */}
      <ValidationModal
        result={validationResult}
        onClose={() => setValidationResult(null)}
      />
    </div>
  );
}

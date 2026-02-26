import { create } from "zustand";

interface RuleBlock {
  id: string;
  type: "ordering" | "batching" | "matching" | "priority" | "filter";
  params: Record<string, unknown>;
  position: { x: number; y: number };
  connections: string[];
}

interface ForgeStore {
  blocks: RuleBlock[];
  selectedBlock: string | null;
  simulationResults: unknown | null;
  isSimulating: boolean;
  addBlock: (block: RuleBlock) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<RuleBlock>) => void;
  selectBlock: (id: string | null) => void;
  setSimulationResults: (results: unknown) => void;
  setIsSimulating: (val: boolean) => void;
  clearBlocks: () => void;
}

export const useForgeStore = create<ForgeStore>((set) => ({
  blocks: [],
  selectedBlock: null,
  simulationResults: null,
  isSimulating: false,
  addBlock: (block) => set((s) => ({ blocks: [...s.blocks, block] })),
  removeBlock: (id) =>
    set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),
  updateBlock: (id, updates) =>
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  selectBlock: (id) => set({ selectedBlock: id }),
  setSimulationResults: (results) => set({ simulationResults: results }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  clearBlocks: () =>
    set({ blocks: [], selectedBlock: null, simulationResults: null }),
}));

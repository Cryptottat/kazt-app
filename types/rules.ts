export type RuleBlockType = "ordering" | "batching" | "matching" | "priority" | "filter";

export interface OrderingParams {
  method: "FIFO" | "price_time" | "pro_rata";
  tiebreaker?: "fee_amount" | "timestamp" | "stake";
}

export interface BatchingParams {
  interval_ms: number;
  max_batch: number;
  min_batch?: number;
}

export interface MatchingParams {
  engine: "clob" | "amm" | "rfq";
  partial_fill?: boolean;
}

export interface PriorityParams {
  factor: "stake" | "fee" | "token_hold" | "custom";
  weight?: number;
}

export interface FilterParams {
  blacklist: string[];
  whitelist: string[];
  max_size?: number;
  min_size?: number;
}

export type RuleParams = OrderingParams | BatchingParams | MatchingParams | PriorityParams | FilterParams;

export interface RuleBlock {
  id: string;
  type: RuleBlockType;
  params: RuleParams;
  position: { x: number; y: number };
  connections: string[];
}

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  blocks: RuleBlock[];
  created_at: number;
  updated_at: number;
  owner: string;
}

export interface SimulationResult {
  tx_id: string;
  outcome: "included" | "filtered" | "batched" | "rejected";
  position?: number;
  batch_id?: number;
  reason?: string;
}

export interface SimulationReport {
  rule_set_id: string;
  results: SimulationResult[];
  total_txs: number;
  processed: number;
  filtered: number;
  conflicts: string[];
}

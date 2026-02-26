"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { features } from "@/lib/features";
import { apiCall } from "@/lib/api";

// -- 타입 정의 --

interface TemplateBlock {
  type: "ordering" | "batching" | "matching" | "priority" | "filter";
  name: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  block_count: number;
  downloads: number;
  price_kazt: number;
  author: string;
  tags: string[];
  created_at: string;
  blocks: TemplateBlock[];
}

// 블록 타입별 색상 (forge RuleBlockNode 컬러 시스템과 동일)
const BLOCK_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ordering: { bg: "bg-[#F97316]/15", text: "text-[#F97316]", border: "border-[#F97316]/30" },
  batching: { bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", border: "border-[#F59E0B]/30" },
  matching: { bg: "bg-[#10B981]/15", text: "text-[#10B981]", border: "border-[#10B981]/30" },
  priority: { bg: "bg-[#3B82F6]/15", text: "text-[#3B82F6]", border: "border-[#3B82F6]/30" },
  filter:   { bg: "bg-[#EF4444]/15", text: "text-[#EF4444]", border: "border-[#EF4444]/30" },
};

// 블록 타입 아이콘 (forge 노드와 동일)
const BLOCK_TYPE_ICONS: Record<string, string> = {
  ordering: "\u2195",
  batching: "\u25A6",
  matching: "\u21CC",
  priority: "\u2605",
  filter:   "\u2298",
};

// -- 폴백 시드 템플릿 (API 실패 시 사용) --
const FALLBACK_TEMPLATES: Template[] = [
  {
    id: "tpl_dex_amm",
    name: "DEX AMM Protection Pack",
    description: "Standard MEV protection rules for AMM-based DEX protocols. Includes FIFO ordering, batch auctions, and sandwich attack filters.",
    block_count: 4, downloads: 1200, price_kazt: 500, author: "0xAbc...123",
    tags: ["defi", "amm", "mev-protection"], created_at: "2025-12-01T00:00:00Z",
    blocks: [
      { type: "ordering", name: "FIFO Queue" }, { type: "batching", name: "Batch Auction Window" },
      { type: "filter", name: "Sandwich Filter" }, { type: "priority", name: "Stake-Weighted Priority" },
    ],
  },
  {
    id: "tpl_lending",
    name: "Lending Protocol Pack",
    description: "Ordering and batching rules optimized for lending protocols. Prevents oracle manipulation and ensures fair liquidation sequencing.",
    block_count: 3, downloads: 890, price_kazt: 300, author: "0xDef...456",
    tags: ["defi", "lending", "liquidation"], created_at: "2025-12-15T00:00:00Z",
    blocks: [
      { type: "ordering", name: "Time-Priority Ordering" }, { type: "batching", name: "Liquidation Batcher" },
      { type: "filter", name: "Oracle Manipulation Guard" },
    ],
  },
  {
    id: "tpl_orderbook",
    name: "Orderbook Fairness Pack",
    description: "Price-time priority ordering with anti-frontrunning filters. Full CLOB matching engine integration with partial fill support.",
    block_count: 5, downloads: 650, price_kazt: 800, author: "0x789...abc",
    tags: ["defi", "orderbook", "clob", "fairness"], created_at: "2026-01-05T00:00:00Z",
    blocks: [
      { type: "ordering", name: "Price-Time Priority" }, { type: "matching", name: "CLOB Engine" },
      { type: "filter", name: "Frontrun Detector" }, { type: "batching", name: "Order Aggregator" },
      { type: "priority", name: "Maker Priority Boost" },
    ],
  },
  {
    id: "tpl_nft_mint",
    name: "NFT Mint Guard",
    description: "Fair minting protection for NFT launches. Randomized ordering prevents bot sniping and ensures equitable distribution.",
    block_count: 2, downloads: 2100, price_kazt: 200, author: "0xMnt...789",
    tags: ["nft", "minting", "anti-bot"], created_at: "2026-01-20T00:00:00Z",
    blocks: [
      { type: "ordering", name: "Randomized Sequencer" }, { type: "filter", name: "Bot Address Blacklist" },
    ],
  },
  {
    id: "tpl_perp_mev",
    name: "Perpetuals MEV Shield",
    description: "MEV protection suite for perpetual futures protocols. Shields against oracle frontrunning and ensures fair position entry ordering.",
    block_count: 4, downloads: 430, price_kazt: 600, author: "0xPrp...321",
    tags: ["defi", "perpetuals", "mev-protection", "derivatives"], created_at: "2026-02-01T00:00:00Z",
    blocks: [
      { type: "ordering", name: "Position Queue" }, { type: "filter", name: "Oracle Frontrun Filter" },
      { type: "batching", name: "Funding Rate Batcher" }, { type: "matching", name: "Counterparty Matcher" },
    ],
  },
  {
    id: "tpl_staking_seq",
    name: "Staking Reward Sequencer",
    description: "Optimized reward distribution sequencing for staking protocols. Batches reward claims and orders by stake weight for gas efficiency.",
    block_count: 3, downloads: 780, price_kazt: 400, author: "0xStk...654",
    tags: ["staking", "rewards", "gas-optimization"], created_at: "2026-02-10T00:00:00Z",
    blocks: [
      { type: "ordering", name: "Stake-Weight Ordering" }, { type: "batching", name: "Reward Claim Batcher" },
      { type: "priority", name: "Validator Priority" },
    ],
  },
];

// -- 정렬 옵션 --
type SortOption = "popular" | "new" | "price_low" | "price_high";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "price_low", label: "Price: Low" },
  { value: "price_high", label: "Price: High" },
];

// -- 스켈레톤 카드 컴포넌트 --
function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-wire-border rounded-lg p-5 animate-pulse">
      <div className="h-5 bg-iron-gray/40 rounded w-3/4 mb-3" />
      <div className="h-3 bg-iron-gray/30 rounded w-1/3 mb-4" />
      <div className="h-3 bg-iron-gray/20 rounded w-full mb-2" />
      <div className="h-3 bg-iron-gray/20 rounded w-5/6 mb-5" />
      <div className="flex gap-4 mb-4">
        <div className="h-3 bg-iron-gray/20 rounded w-16" />
        <div className="h-3 bg-iron-gray/20 rounded w-16" />
      </div>
      <div className="h-5 bg-molten-gold/20 rounded w-24 mb-4" />
      <div className="flex gap-2">
        <div className="h-9 bg-iron-gray/20 rounded flex-1" />
        <div className="h-9 bg-iron-gray/20 rounded flex-1" />
      </div>
    </div>
  );
}

// -- 템플릿 카드 컴포넌트 --
function TemplateCard({
  template,
  onPreview,
  onUse,
}: {
  template: Template;
  onPreview: (t: Template) => void;
  onUse: (t: Template) => void;
}) {
  return (
    <div className="group bg-bg-card border border-wire-border rounded-lg hover:border-forge-orange/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)] flex flex-col">
      {/* 상단 악센트 라인 */}
      <div className="h-[2px] bg-gradient-to-r from-forge-orange/60 via-molten-gold/40 to-transparent rounded-t-lg" />

      <div className="p-5 flex flex-col flex-1">
        {/* 템플릿 이름 */}
        <h3 className="font-display text-base font-bold uppercase tracking-wider text-text-primary group-hover:text-forge-orange transition-colors">
          {template.name}
        </h3>

        {/* 작성자 */}
        <p className="text-text-muted text-xs font-mono mt-1">
          by {template.author}
        </p>

        {/* 설명 (2줄 제한) */}
        <p className="text-text-secondary text-sm mt-3 line-clamp-2 leading-relaxed flex-1">
          {template.description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-wire-border text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 통계 행 */}
        <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
          {/* 블록 수 */}
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-text-secondary">{template.block_count}</span> blocks
          </span>

          {/* 다운로드 수 */}
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <path d="M12 3v12M5 12l7 7 7-7M5 20h14" />
            </svg>
            <span className="text-text-secondary">{template.downloads.toLocaleString()}</span>
          </span>
        </div>

        {/* 가격 */}
        <div className="mt-3">
          <span className="font-display text-lg font-bold text-molten-gold">
            {template.price_kazt.toLocaleString()}
          </span>
          <span className="text-molten-gold/70 text-xs ml-1 font-mono">
            $KAZT
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onPreview(template)}
            className="cursor-hammer flex-1 px-3 py-2 text-xs font-display uppercase tracking-wider border border-wire-border text-text-secondary rounded hover:border-forge-orange/50 hover:text-forge-orange transition-all duration-200"
          >
            Preview
          </button>
          <button
            onClick={() => onUse(template)}
            className="cursor-hammer flex-1 px-3 py-2 text-xs font-display uppercase tracking-wider bg-forge-orange text-white rounded hover:bg-forge-orange-light transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}

// -- 프리뷰 모달 컴포넌트 --
function PreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: Template;
  onClose: () => void;
  onUse: (t: Template) => void;
}) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 모달 컨텐츠 */}
      <div
        className="relative bg-bg-elevated border border-wire-border rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 악센트 */}
        <div className="h-[2px] bg-gradient-to-r from-forge-orange via-molten-gold to-forge-orange rounded-t-lg" />

        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
                {template.name}
              </h2>
              <p className="text-text-muted text-xs font-mono mt-1">
                by {template.author}
              </p>
            </div>
            <button
              onClick={onClose}
              className="cursor-hammer p-1 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 설명 */}
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {template.description}
          </p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-wire-border text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 블록 구성 */}
          <div className="mb-5">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
              Block Composition
            </h3>
            <div className="space-y-2">
              {template.blocks.map((block, idx) => {
                const colors = BLOCK_TYPE_COLORS[block.type] || BLOCK_TYPE_COLORS.ordering;
                const icon = BLOCK_TYPE_ICONS[block.type] || "";
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2 rounded border ${colors.bg} ${colors.border}`}
                  >
                    <span className={`text-sm ${colors.text}`}>{icon}</span>
                    <span className={`text-xs font-display uppercase tracking-wider font-bold ${colors.text}`}>
                      {block.type}
                    </span>
                    <span className="text-text-secondary text-xs ml-auto font-mono">
                      {block.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-6 py-3 border-t border-wire-border text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="text-text-secondary">{template.block_count}</span> blocks
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12M5 12l7 7 7-7M5 20h14" />
              </svg>
              <span className="text-text-secondary">{template.downloads.toLocaleString()}</span> downloads
            </span>
          </div>

          {/* 가격 + 액션 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-wire-border">
            <div>
              <span className="font-display text-2xl font-bold text-molten-gold">
                {template.price_kazt.toLocaleString()}
              </span>
              <span className="text-molten-gold/70 text-sm ml-1.5 font-mono">
                $KAZT
              </span>
            </div>
            <button
              onClick={() => onUse(template)}
              className="cursor-hammer px-6 py-2.5 text-sm font-display uppercase tracking-wider bg-forge-orange text-white rounded hover:bg-forge-orange-light transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- 메인 페이지 컴포넌트 --

export default function TemplatesPage() {
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // API에서 템플릿 목록 가져오기 (실패 시 폴백 데이터 사용)
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiCall<Template[]>("/api/templates");
    if (res.success && res.data) {
      setTemplates(res.data);
    } else {
      // API 실패 시 시드 템플릿으로 폴백
      setTemplates(FALLBACK_TEMPLATES);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // 클라이언트 사이드 검색 필터링
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [templates, search]);

  // 정렬 적용
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "popular":
        return arr.sort((a, b) => b.downloads - a.downloads);
      case "new":
        return arr.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "price_low":
        return arr.sort((a, b) => a.price_kazt - b.price_kazt);
      case "price_high":
        return arr.sort((a, b) => b.price_kazt - a.price_kazt);
      default:
        return arr;
    }
  }, [filtered, sort]);

  // 템플릿 사용 -- forge 페이지로 이동 (쿼리 파라미터로 템플릿 ID 전달)
  const handleUseTemplate = useCallback(
    (template: Template) => {
      router.push(`/forge?template=${template.id}`);
    },
    [router]
  );

  // 프리뷰 열기
  const handlePreview = useCallback((template: Template) => {
    setPreviewTemplate(template);
  }, []);

  // 프리뷰 닫기
  const handleClosePreview = useCallback(() => {
    setPreviewTemplate(null);
  }, []);

  // 피처 플래그 비활성 시 커밍순 화면
  if (!features.templates) {
    return (
      <div className="h-screen flex flex-col bg-bg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 mt-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wider text-text-primary">
            Template Marketplace
          </h1>
          <p className="mt-4 text-text-secondary text-lg">
            Coming Soon
          </p>
          <a
            href="/"
            className="mt-8 px-8 py-3 border border-forge-orange text-forge-orange font-display uppercase tracking-wider text-sm rounded hover:bg-forge-orange hover:text-white transition-all duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 mt-16">
        {/* 헤더 영역 */}
        <section className="relative border-b border-wire-border bg-bg-elevated">
          {/* 배경 장식 -- 미세한 그라데이션 글로우 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-forge-orange/5 rounded-full blur-[100px]" />
            <div className="absolute top-0 right-1/4 w-[300px] h-[150px] bg-molten-gold/5 rounded-full blur-[80px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* 제목 */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary">
              Template{" "}
              <span className="text-forge-orange">Marketplace</span>
            </h1>
            <p className="mt-3 text-text-secondary text-base sm:text-lg max-w-xl">
              Pre-forged rule sets. Battle-tested by the community.
            </p>

            {/* 검색 + 정렬 컨트롤 */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {/* 검색 입력 */}
              <div className="relative flex-1 max-w-md">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-bg border border-wire-border rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-forge-orange/50 transition-colors"
                />
              </div>

              {/* 정렬 드롭다운 */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="cursor-hammer px-4 py-2.5 bg-bg border border-wire-border rounded text-sm text-text-secondary font-display uppercase tracking-wider focus:outline-none focus:border-forge-orange/50 transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  paddingRight: "36px",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 템플릿 그리드 영역 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* 로딩 상태 */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* 에러 상태 */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-text-secondary text-lg mb-2">
                Failed to load templates. The forge rests.
              </p>
              <p className="text-text-muted text-sm mb-6">{error}</p>
              <button
                onClick={fetchTemplates}
                className="cursor-hammer px-6 py-2.5 text-sm font-display uppercase tracking-wider border border-forge-orange text-forge-orange rounded hover:bg-forge-orange hover:text-white transition-all duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {/* 빈 검색 결과 */}
          {!loading && !error && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-muted mb-4">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <p className="text-text-secondary text-lg">
                No templates match your search.
              </p>
              <p className="text-text-muted text-sm mt-1">
                Try a different keyword or clear your search.
              </p>
            </div>
          )}

          {/* 템플릿 그리드 */}
          {!loading && !error && sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sorted.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* 프리뷰 모달 */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={handleClosePreview}
          onUse={handleUseTemplate}
        />
      )}
    </div>
  );
}

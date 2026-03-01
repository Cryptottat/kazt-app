"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.kazt.fun";

type AuthStep = "connect" | "sign" | "done";

interface AuthResult {
  api_key: string;
  wallet: string;
  tier: string;
}

export default function AuthPage() {
  const { publicKey, signMessage, connected } = useWallet();
  const [step, setStep] = useState<AuthStep>("connect");
  const [result, setResult] = useState<AuthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSign = useCallback(async () => {
    if (!publicKey || !signMessage) return;

    setLoading(true);
    setError(null);

    try {
      const address = publicKey.toBase58();
      const message = `Sign this message to authenticate with Kazt.\nWallet: ${address}\nService: kazt.fun\nThis request does not trigger a blockchain transaction.`;

      const encoded = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encoded);
      const signature = bs58.encode(signatureBytes);

      const res = await fetch(`${API_URL}/api/auth/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, signature, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.detail || "Authentication failed");
      }

      setResult(data.data);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  }, [publicKey, signMessage]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  // 지갑이 연결되면 자동으로 sign 단계로 전환
  if (connected && step === "connect") {
    setStep("sign");
  }

  return (
    <div className="min-h-screen bg-[#0C0E12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-pixel)] text-[#F97316] text-sm uppercase tracking-wider mb-2">
            Kazt API Key
          </h1>
          <p className="text-[#9CA3AF] text-xs font-mono">
            Connect your wallet to get an API key for Kazt Forge Desktop.
          </p>
        </div>

        {/* Card */}
        <div className="border border-[#374151] bg-[#0C0E12] p-6 space-y-6">
          {/* Step 1: Connect Wallet */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`w-5 h-5 flex items-center justify-center text-[9px] font-mono border ${
                  step !== "connect"
                    ? "border-[#F97316] text-[#F97316]"
                    : "border-[#374151] text-[#9CA3AF]"
                }`}
              >
                1
              </span>
              <span className="text-[#F3F4F6] text-xs font-mono uppercase tracking-wider">
                Connect Wallet
              </span>
            </div>
            <div className="ml-7">
              <WalletMultiButton
                style={{
                  backgroundColor: connected ? "#374151" : "#F97316",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  height: "36px",
                  borderRadius: "0",
                }}
              />
            </div>
          </div>

          {/* Step 2: Sign & Get API Key */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`w-5 h-5 flex items-center justify-center text-[9px] font-mono border ${
                  step === "done"
                    ? "border-[#F97316] text-[#F97316]"
                    : step === "sign"
                    ? "border-[#F3F4F6] text-[#F3F4F6]"
                    : "border-[#374151] text-[#9CA3AF]"
                }`}
              >
                2
              </span>
              <span className="text-[#F3F4F6] text-xs font-mono uppercase tracking-wider">
                Sign &amp; Get API Key
              </span>
            </div>
            <div className="ml-7">
              {step === "sign" && (
                <button
                  onClick={handleSign}
                  disabled={loading}
                  className="px-4 py-2 bg-[#F97316] text-[#0C0E12] font-mono text-xs uppercase tracking-wider hover:bg-[#FB923C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing..." : "Sign & Get API Key"}
                </button>
              )}
              {step === "connect" && (
                <p className="text-[#9CA3AF] text-[10px] font-mono">
                  Connect your wallet first.
                </p>
              )}
            </div>
          </div>

          {/* Step 3: API Key Display */}
          {step === "done" && result && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 flex items-center justify-center text-[9px] font-mono border border-[#F97316] text-[#F97316]">
                  3
                </span>
                <span className="text-[#F3F4F6] text-xs font-mono uppercase tracking-wider">
                  Your API Key
                </span>
              </div>
              <div className="ml-7 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.api_key}
                    className="flex-1 px-3 py-2 bg-[#1a1d24] border border-[#374151] text-[#F3F4F6] font-mono text-[10px] select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 border border-[#374151] text-[#F3F4F6] font-mono text-[10px] hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#9CA3AF] text-[10px] font-mono">
                    Tier:
                  </span>
                  <span className="text-[#F97316] text-[10px] font-mono uppercase">
                    {result.tier}
                  </span>
                </div>
                <p className="text-[#9CA3AF] text-[10px] font-mono leading-relaxed">
                  Paste this key into Kazt Forge Desktop &rarr; Settings &rarr;
                  API Key.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="ml-7 px-3 py-2 border border-red-500/30 bg-red-500/10">
              <p className="text-red-400 text-[10px] font-mono">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[#9CA3AF] text-[9px] font-mono mt-4">
          This signature only verifies wallet ownership. No transaction is made.
        </p>
      </div>
    </div>
  );
}

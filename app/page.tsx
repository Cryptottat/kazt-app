export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-display text-6xl font-bold text-forge-orange mb-4">
        Kazt
      </h1>
      <p className="text-text-secondary text-xl mb-8">
        Pour your rules. Set them in chain.
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-forge-orange text-white font-display uppercase tracking-wider rounded hover:bg-forge-orange-light transition-colors">
          Launch Forge
        </button>
        <button className="px-6 py-3 border border-wire-border text-text-primary font-display uppercase tracking-wider rounded hover:border-wire-border-hover transition-colors">
          Buy $KAZT
        </button>
      </div>
    </main>
  );
}

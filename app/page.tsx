import Header from "@/components/common/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import AppPreview from "@/components/sections/AppPreview";
import Features from "@/components/sections/Features";
import TokenUtility from "@/components/sections/TokenUtility";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/common/Footer";
import { features } from "@/lib/features";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <Hero />
      <Problem />
      <HowItWorks />
      <AppPreview />
      <Features />
      {features.showTokenInfo && <TokenUtility />}
      <CTA />
      <Footer />
    </main>
  );
}

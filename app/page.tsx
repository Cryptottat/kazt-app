import Header from "@/components/common/Header";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TokenUtility from "@/components/sections/TokenUtility";
import Footer from "@/components/common/Footer";
import { features } from "@/lib/features";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <Hero />
      <HowItWorks />
      {features.showTokenInfo && <TokenUtility />}
      <Footer />
    </main>
  );
}

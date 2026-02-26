import Header from "@/components/common/Header";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TokenUtility from "@/components/sections/TokenUtility";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <Hero />
      <HowItWorks />
      <TokenUtility />
      <Footer />
    </main>
  );
}

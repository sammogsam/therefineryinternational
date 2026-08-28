import Hero from "@/components/sections/Hero";
import Mandate from "@/components/sections/Mandate";
import WhyRefinery from "@/components/sections/WhyRefinery";
import HeartForChildren from "@/components/sections/HeartForChildren";
import Programs from "@/components/sections/Programs";
import Gallery from "@/components/sections/Gallery";
import CallToAction from "@/components/sections/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Mandate />
      <WhyRefinery />
      <HeartForChildren />
      <Programs />
      <Gallery />
      <CallToAction />
    </main>
  );
}
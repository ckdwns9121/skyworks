"use client";

import SpaceSection from "../components/sections/SpaceSection/SpaceSection";
import HeroSection from "../components/sections/HeroSection/HeroSection";
import TextMarqueeSection from "@/components/sections/TextMarqueeSection/TextMarqueeSection";
import ClientMarqueeSection from "@/components/sections/ClientMarqueeSection/ClientMarqueeSection";
import VideoReelSection from "@/components/sections/VideoReelSection/VideoReelSection";
import FeaturesTabSection from "@/components/sections/FeaturesTabSection/FeaturesTabSection";
import ContactSection from "@/components/sections/ContactSection/ContactSection";
import FooterSection from "@/components/sections/FooterSection/FooterSection";
import { VIDEO_REEL_VIDEO_LIST } from "@/constants/video";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function Home() {
  const { pageRef, clientDark, setClientDark } = useScrollProgress();

  return (
    <main className="pb-[680px]">
      <div ref={pageRef}>
        <HeroSection />
        <section data-space-section>
          <SpaceSection />
        </section>
        <ClientMarqueeSection onDarkChange={setClientDark} />
        <VideoReelSection dark={clientDark} videos={VIDEO_REEL_VIDEO_LIST} />
        <TextMarqueeSection text="About SKYWorKS" />
        <FeaturesTabSection />
        <ContactSection />
      </div>
      <FooterSection />
    </main>
  );
}

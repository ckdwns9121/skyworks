"use client";

import SpaceSection from "../components/sections/SpaceSection/SpaceSection";
import HeroSection from "../components/sections/HeroSection/HeroSection";
import TextMarqueeSection from "@/components/sections/TextMarqueeSection/TextMarqueeSection";
import ClientMarqueeSection from "@/components/sections/ClientMarqueeSection/ClientMarqueeSection";
import VideoReelSection from "@/components/sections/VideoReelSection/VideoReelSection";
import FeaturesTabSection from "@/components/sections/FeaturesTabSection/FeaturesTabSection";
import ContactSection from "@/components/sections/ContactSection/ContactSection";
import FooterSection from "@/components/layout/FooterSection";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { VIDEO_REEL_VIDEO_LIST } from "@/constants/video";
import { useScrollProgress } from "@/hooks/scroll/useScrollProgress";

export default function Home() {
  const { pageRef, clientDark, setClientDark, error } = useScrollProgress();

  // 스크롤 진행률 추적에 오류가 발생한 경우 사용자에게 알림
  if (error) {
    console.error("스크롤 진행률 추적 오류:", error);
    // 프로덕션에서는 사용자 친화적인 에러 UI를 표시할 수 있습니다
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("메인 페이지에서 에러 발생:", error, errorInfo);
      }}
    >
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
    </ErrorBoundary>
  );
}

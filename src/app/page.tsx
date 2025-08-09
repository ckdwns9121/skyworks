"use client";

import SpaceSection from "../components/sections/SpaceSection/SpaceSection";
import HeroSection from "../components/sections/HeroSection/HeroSection";
import TextMarqueeSection from "@/components/sections/TextMarqueeSection/TextMarqueeSection";
import ClientMarqueeSection from "@/components/sections/ClientMarqueeSection/ClientMarqueeSection";
import VideoReelSection from "@/components/sections/VideoReelSection/VideoReelSection";
import FeaturesTabSection from "@/components/sections/FeaturesTabSection/FeaturesTabSection";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const [clientDark, setClientDark] = useState(false);
  const videoReelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;
    marqueeRef.current = container.querySelector<HTMLElement>("[data-marquee-section]");
    videoReelRef.current = container.querySelector<HTMLElement>("[data-video-reel]");
    const spaceSection = container.querySelector<HTMLElement>("section[data-space-section]");
    if (!marqueeRef.current || !spaceSection) return;

    const handleScroll = () => {
      const spaceRect = spaceSection.getBoundingClientRect();
      const start = spaceRect.bottom - window.innerHeight; // 스페이스 섹션 하단이 화면 하단과 만나는 지점
      const end = spaceRect.bottom; // 완전히 지나칠 때
      const current = 0; // 기준은 viewport top(0)
      const progressRaw = (current - start) / (end - start || 1);
      const progress = Math.min(1, Math.max(0, progressRaw));
      marqueeRef.current!.style.setProperty("--progress", String(progress));
      // VideoReel 진행률: 상단 30%까지는 0, 이후 70% 구간에서 0->1
      if (videoReelRef.current) {
        const rect = videoReelRef.current.getBoundingClientRect();
        const total = rect.height;
        const y = Math.min(Math.max(-rect.top, 0), total); // 0 ~ height
        const startAt = total * 0.3;
        const endAt = total * 1.0; // 바닥까지
        const raw = (y - startAt) / (endAt - startAt || 1);
        const p = Math.min(1, Math.max(0, raw));
        videoReelRef.current.style.setProperty("--videoProgress", String(p));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div ref={pageRef}>
      <HeroSection />
      <section data-space-section>
        <SpaceSection />
      </section>
      {/* Space 끝 무렵: 클라이언트 로고 마퀴 섹션 (다크 상태 콜백을 페이지에서 수신) */}
      <ClientMarqueeSection onDarkChange={setClientDark} />
      {/* 비디오 릴 섹션 분리 */}
      <VideoReelSection
        dark={clientDark}
        videos={[
          { src: "/videos/video_main-music.mp4", text: "Music & Live" },
          { src: "/videos/video_main-ad.mp4", text: "Advertising & Promotion" },
          { src: "/videos/video_main-product.mp4", text: "Product promotion" },
          { src: "/videos/video_main-youtube.mp4", text: "Youtube content" },
          { src: "/videos/video_main-sketch.mp4", text: "Marketing & Sketch" },
        ]}
      />
      <TextMarqueeSection text="About SKYWorKS" />
      <FeaturesTabSection />
    </div>
  );
}

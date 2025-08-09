"use client";

import SpaceSection from "../components/sections/SpaceSection/SpaceSection";
import HeroSection from "../components/sections/HeroSection/HeroSection";
import TextMarqueeSection from "@/components/sections/TextMarqueeSection/TextMarqueeSection";
import { useEffect, useRef } from "react";

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;
    marqueeRef.current = container.querySelector<HTMLElement>("[data-marquee-section]");
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
      <TextMarqueeSection text="About SKYWorKS" />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

interface ScrollProgressOptions {
  spaceSectionSelector?: string;
  marqueeSectionSelector?: string;
  videoReelSelector?: string;
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const {
    spaceSectionSelector = "section[data-space-section]",
    marqueeSectionSelector = "[data-marquee-section]",
    videoReelSelector = "[data-video-reel]",
  } = options;

  const pageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const videoReelRef = useRef<HTMLElement | null>(null);
  const [clientDark, setClientDark] = useState(false);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;

    // 요소들 찾기
    marqueeRef.current = container.querySelector<HTMLElement>(marqueeSectionSelector);
    videoReelRef.current = container.querySelector<HTMLElement>(videoReelSelector);
    const spaceSection = container.querySelector<HTMLElement>(spaceSectionSelector);

    if (!marqueeRef.current || !spaceSection) return;

    const handleScroll = () => {
      // Marquee 진행률 계산
      const spaceRect = spaceSection.getBoundingClientRect();
      const start = spaceRect.bottom - window.innerHeight;
      const end = spaceRect.bottom;
      const current = 0;
      const progressRaw = (current - start) / (end - start || 1);
      const progress = Math.min(1, Math.max(0, progressRaw));

      marqueeRef.current!.style.setProperty("--progress", String(progress));

      // VideoReel 진행률 계산
      if (videoReelRef.current) {
        const rect = videoReelRef.current.getBoundingClientRect();
        const total = rect.height;
        const y = Math.min(Math.max(-rect.top, 0), total);
        const startAt = total * 0.3;
        const endAt = total * 1.0;
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
  }, [spaceSectionSelector, marqueeSectionSelector, videoReelSelector]);

  return {
    pageRef,
    clientDark,
    setClientDark,
  };
}

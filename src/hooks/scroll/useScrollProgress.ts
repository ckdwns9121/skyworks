import { useEffect, useRef, useState, useCallback } from "react";
import { safeGetBoundingRect, safeSetCSSProperty, safeQuerySelector, getWindowDimensions } from "@/utils/domUtils";

interface ScrollProgressOptions {
  spaceSectionSelector?: string;
  marqueeSectionSelector?: string;
  videoReelSelector?: string;
  throttleMs?: number; // 스크롤 이벤트 쓰로틀링 간격
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const {
    spaceSectionSelector = "section[data-space-section]",
    marqueeSectionSelector = "[data-marquee-section]",
    videoReelSelector = "[data-video-reel]",
    throttleMs = 16, // 60fps
  } = options;

  const pageRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const videoReelRef = useRef<HTMLElement | null>(null);
  const [clientDark, setClientDark] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 쓰로틀링을 위한 ref
  const lastScrollTimeRef = useRef<number>(0);
  const pendingScrollRef = useRef<boolean>(false);

  // 스크롤 핸들러를 useCallback으로 메모이제이션
  const handleScroll = useCallback(() => {
    const now = Date.now();

    // 쓰로틀링 체크
    if (now - lastScrollTimeRef.current < throttleMs) {
      if (!pendingScrollRef.current) {
        pendingScrollRef.current = true;
        // 다음 프레임에서 실행
        requestAnimationFrame(() => {
          pendingScrollRef.current = false;
          handleScroll();
        });
      }
      return;
    }

    lastScrollTimeRef.current = now;

    try {
      // Marquee 진행률 계산
      if (marqueeRef.current) {
        const spaceSection = safeQuerySelector<HTMLElement>(pageRef.current, spaceSectionSelector);
        if (spaceSection) {
          const spaceRect = safeGetBoundingRect(spaceSection);
          if (spaceRect) {
            const { height: windowHeight } = getWindowDimensions();
            const start = spaceRect.bottom - windowHeight;
            const end = spaceRect.bottom;
            const current = 0;
            const progressRaw = (current - start) / (end - start || 1);
            const progress = Math.min(1, Math.max(0, progressRaw));

            // 안전한 CSS 속성 설정
            safeSetCSSProperty(marqueeRef.current, "--progress", String(progress));
          }
        }
      }

      // VideoReel 진행률 계산
      if (videoReelRef.current) {
        const rect = safeGetBoundingRect(videoReelRef.current);
        if (rect) {
          const total = rect.height;
          const y = Math.min(Math.max(-rect.top, 0), total);
          const startAt = total * 0.3;
          const endAt = total * 1.0;
          const raw = (y - startAt) / (endAt - startAt || 1);
          const p = Math.min(1, Math.max(0, raw));

          safeSetCSSProperty(videoReelRef.current, "--videoProgress", String(p));
        }
      }
    } catch (error) {
      console.error("스크롤 핸들러 실행 중 오류 발생:", error);
      setError("스크롤 처리 중 오류가 발생했습니다.");
    }
  }, [spaceSectionSelector, marqueeSectionSelector, videoReelSelector, throttleMs]);

  // 리사이즈 핸들러를 useCallback으로 메모이제이션
  const handleResize = useCallback(() => {
    // 리사이즈 시 스크롤 핸들러 즉시 실행
    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) {
      setError("페이지 컨테이너를 찾을 수 없습니다.");
      return;
    }

    try {
      // 요소들 찾기 - 안전한 쿼리 셀렉터 사용
      marqueeRef.current = safeQuerySelector<HTMLElement>(container, marqueeSectionSelector);
      videoReelRef.current = safeQuerySelector<HTMLElement>(container, videoReelSelector);

      if (!marqueeRef.current) {
        setError("필요한 섹션 요소들을 찾을 수 없습니다.");
        return;
      }

      // 이벤트 리스너 등록 - passive 옵션으로 성능 향상
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize, { passive: true });

      // 초기 실행
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    } catch (error) {
      console.error("useScrollProgress 초기화 중 오류 발생:", error);
      setError("스크롤 진행률 추적 초기화에 실패했습니다.");
    }
  }, [handleScroll, handleResize, marqueeSectionSelector, videoReelSelector]);

  return {
    pageRef,
    clientDark,
    setClientDark,
    error,
  };
}

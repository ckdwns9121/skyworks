"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function LenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Lenis 부드러운 스크롤 초기화
  useEffect(() => {
    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
    }

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // 윈도우 리사이즈 시 Lenis 업데이트
    const resizeObserver = new ResizeObserver(() => {
      lenisRef.current?.resize();
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      // 컴포넌트가 완전히 언마운트될 때만 파괴
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // 페이지 변경 시 Lenis 리셋 및 스크롤 위치 초기화
  useEffect(() => {
    if (lenisRef.current) {
      // 페이지 변경 시 스크롤 위치 초기화 및 Lenis 리셋
      window.scrollTo(0, 0);
      lenisRef.current.scrollTo(0, { immediate: true });

      // Lenis 인스턴스 재계산
      setTimeout(() => {
        lenisRef.current?.resize();
      }, 100);
    }
  }, [pathname]);

  return null;
}

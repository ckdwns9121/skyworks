"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import StickyNav from "@/components/common/StickyNav";
import VideoScale from "@/components/common/VideoScale";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import styles from "./VideoReelSection.module.css";
import Image from "next/image";
import { safeGetBoundingRect, getWindowDimensions, validateRefs } from "@/utils/domUtils";

export type VideoItem = { src: string; text: string };

type VideoReelSectionProps = {
  videos: VideoItem[];
  dark?: boolean;
};

export default function VideoReelSection({ videos, dark = false }: VideoReelSectionProps) {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 쓰로틀링을 위한 ref
  const lastScrollTimeRef = useRef<number>(0);
  const pendingScrollRef = useRef<boolean>(false);
  const throttleMs = 16; // 60fps

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
      const { height: windowHeight } = getWindowDimensions();
      if (windowHeight === 0) {
        console.warn("윈도우 높이 정보를 가져올 수 없습니다.");
        return;
      }

      const windowCenter = windowHeight / 2;
      let minDist = Infinity;
      let idx = 0;

      // 유효한 ref들만 필터링
      const validRefs = validateRefs(videoRefs.current);

      if (validRefs.length === 0) {
        console.warn("유효한 비디오 ref가 없습니다.");
        return;
      }

      validRefs.forEach((ref, i) => {
        const rect = safeGetBoundingRect(ref);
        if (!rect) {
          console.warn(`비디오 ${i}의 위치 정보를 가져올 수 없습니다.`);
          return;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - windowCenter);

        if (dist < minDist) {
          minDist = dist;
          idx = i;
        }
      });

      setCurrentVideoIdx(idx);
    } catch (error) {
      console.error("스크롤 핸들러 실행 중 오류 발생:", error);
      setError("비디오 인덱스 계산 중 오류가 발생했습니다.");
    }
  }, [throttleMs]);

  // 리사이즈 핸들러를 useCallback으로 메모이제이션
  const handleResize = useCallback(() => {
    // 리사이즈 시 스크롤 핸들러 즉시 실행
    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    // 이벤트 리스너 등록 - passive 옵션으로 성능 향상
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // 초기 실행
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  // 에러가 발생한 경우 사용자에게 알림
  if (error) {
    console.error("VideoReelSection 오류:", error);
    return (
      <div className="h-[120vh] flex flex-col items-center justify-center">
        <ErrorDisplay error={error} variant="card" onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }} className={styles.wrapper} data-video-reel>
      <StickyNav titles={videos.map((v) => v.text)} index={currentVideoIdx} total={videos.length} />
      {videos.map((item, idx) => (
        <VideoScale
          key={idx}
          videoSrc={item.src}
          text={item.text}
          index={idx}
          dark={dark}
          ref={(el) => {
            if (el) {
              videoRefs.current[idx] = el;
            }
          }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full">
        여기여기
        <Image src="/logo.svg" alt="logo" width={131} height={20} />
      </div>
    </div>
  );
}

/**
 * VideoScale 컴포넌트의 애니메이션 로직을 담당하는 훅
 */

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { safeGetBoundingRect, getWindowDimensions } from "@/utils/domUtils";
import { calculateScale, calculateOpacity } from "@/utils/animation/calculations";
import { calculateCenterDistance, calculateMaxDistance, isNearCenter } from "@/utils/scroll/calculations";

interface UseVideoScaleOptions {
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
  centerThreshold?: number;
  updateInterval?: number; // 애니메이션 업데이트 간격 (ms)
}

interface UseVideoScaleReturn {
  scale: number;
  opacity: number;
  error: string | null;
  isAnimating: boolean;
  ref: React.RefObject<HTMLDivElement>;
}

const DEFAULT_OPTIONS: Required<UseVideoScaleOptions> = {
  minScale: 0.8,
  maxScale: 1.45,
  minOpacity: 0.3,
  maxOpacity: 1.0,
  centerThreshold: 0.3,
  updateInterval: 16, // 60fps
};

export const useVideoScale = (options: UseVideoScaleOptions = {}): UseVideoScaleReturn => {
  const { minScale, maxScale, minOpacity, maxOpacity, centerThreshold, updateInterval } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(minScale);
  const [opacity, setOpacity] = useState(minOpacity);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // 애니메이션 계산 함수를 useCallback으로 메모이제이션
  const calculateAnimationValues = useCallback(() => {
    try {
      if (!sectionRef.current) {
        return { shouldUpdate: false };
      }

      const rect = safeGetBoundingRect(sectionRef.current);
      if (!rect) {
        return { shouldUpdate: false };
      }

      const { height: windowHeight } = getWindowDimensions();
      if (windowHeight === 0) {
        return { shouldUpdate: false };
      }

      // 섹션이 뷰포트 중앙 근처에 있는지 확인
      const isNear = isNearCenter(rect, windowHeight, centerThreshold);

      // 중앙 근처에 있지 않으면 애니메이션 중단
      if (!isNear) {
        return { shouldUpdate: false };
      }

      const distance = calculateCenterDistance(rect, windowHeight);
      const maxDistance = calculateMaxDistance(rect, windowHeight);

      const newScale = calculateScale(distance, maxDistance, minScale, maxScale);
      const newOpacity = calculateOpacity(distance, maxDistance, minOpacity, maxOpacity);

      return {
        shouldUpdate: true,
        scale: newScale,
        opacity: newOpacity,
      };
    } catch (error) {
      console.error("애니메이션 계산 중 오류 발생:", error);
      setError("애니메이션 계산 중 오류가 발생했습니다.");
      return { shouldUpdate: false };
    }
  }, [minScale, maxScale, minOpacity, maxOpacity, centerThreshold]);

  // 애니메이션 루프를 useCallback으로 메모이제이션
  const animationLoop = useCallback(
    (currentTime: number) => {
      // 업데이트 간격 체크
      if (currentTime - lastUpdateTimeRef.current < updateInterval) {
        rafRef.current = requestAnimationFrame(animationLoop);
        return;
      }

      const result = calculateAnimationValues();

      if (result.shouldUpdate && result.scale !== undefined && result.opacity !== undefined) {
        setScale(result.scale);
        setOpacity(result.opacity);
        setIsAnimating(true);
      } else {
        setIsAnimating(false);
      }

      lastUpdateTimeRef.current = currentTime;
      rafRef.current = requestAnimationFrame(animationLoop);
    },
    [calculateAnimationValues, updateInterval]
  );

  // 애니메이션 시작/중지 함수
  const startAnimation = useCallback(() => {
    if (rafRef.current) return; // 이미 실행 중이면 중복 시작 방지

    setIsAnimating(true);
    rafRef.current = requestAnimationFrame(animationLoop);
  }, [animationLoop]);

  const stopAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  // Intersection Observer를 사용하여 섹션이 뷰포트에 보일 때만 애니메이션 실행
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
          // 뷰포트를 벗어나면 기본값으로 복원
          setScale(minScale);
          setOpacity(minOpacity);
        }
      },
      {
        threshold: 0.1, // 10% 이상 보일 때 감지
        rootMargin: "50px", // 여백 추가
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      stopAnimation();
    };
  }, [startAnimation, stopAnimation, minScale, minOpacity]);

  // 윈도우 리사이즈 시 애니메이션 재시작
  useEffect(() => {
    const handleResize = () => {
      if (isAnimating) {
        stopAnimation();
        startAnimation();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isAnimating, startAnimation, stopAnimation]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  // 에러 발생 시 기본값으로 복원
  useEffect(() => {
    if (error) {
      setScale(minScale);
      setOpacity(minOpacity);
      setIsAnimating(false);
    }
  }, [error, minScale, minOpacity]);

  return {
    scale,
    opacity,
    error,
    isAnimating,
    ref: sectionRef,
  };
};

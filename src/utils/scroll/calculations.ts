/**
 * 스크롤 관련 계산을 위한 순수 함수들
 */

import { DOMRect } from "@/types/common";

/**
 * 섹션이 뷰포트에 얼마나 보이는지 계산
 * @param rect 섹션의 getBoundingClientRect 결과
 * @param windowHeight 윈도우 높이
 * @returns 0~1 사이의 가시성 비율
 */
export const calculateVisibilityRatio = (rect: DOMRect, windowHeight: number): number => {
  const sectionTop = rect.top;
  const sectionBottom = rect.bottom;
  const sectionHeight = rect.height;

  // 섹션이 완전히 뷰포트 위에 있는 경우
  if (sectionBottom <= 0) return 0;

  // 섹션이 완전히 뷰포트 아래에 있는 경우
  if (sectionTop >= windowHeight) return 0;

  // 섹션이 뷰포트와 겹치는 부분 계산
  const visibleTop = Math.max(0, sectionTop);
  const visibleBottom = Math.min(windowHeight, sectionBottom);
  const visibleHeight = visibleBottom - visibleTop;

  return Math.max(0, Math.min(1, visibleHeight / sectionHeight));
};

/**
 * 섹션 중심과 윈도우 중심 사이의 거리 계산
 * @param rect 섹션의 getBoundingClientRect 결과
 * @param windowHeight 윈도우 높이
 * @returns 섹션 중심과 윈도우 중심 사이의 거리
 */
export const calculateCenterDistance = (rect: DOMRect, windowHeight: number): number => {
  const sectionCenter = rect.top + rect.height / 2;
  const windowCenter = windowHeight / 2;
  return Math.abs(sectionCenter - windowCenter);
};

/**
 * 최대 거리 계산 (섹션이 뷰포트 중앙에 있을 때의 거리)
 * @param rect 섹션의 getBoundingClientRect 결과
 * @param windowHeight 윈도우 높이
 * @returns 최대 거리
 */
export const calculateMaxDistance = (rect: DOMRect, windowHeight: number): number => {
  return windowHeight / 2 + rect.height / 2;
};

/**
 * 스크롤 진행률 계산
 * @param currentScrollY 현재 스크롤 Y 위치
 * @param elementTop 요소의 상단 위치
 * @param elementHeight 요소의 높이
 * @param windowHeight 윈도우 높이
 * @returns 0~1 사이의 진행률
 */
export const calculateScrollProgress = (
  currentScrollY: number,
  elementTop: number,
  elementHeight: number,
  windowHeight: number
): number => {
  const start = elementTop - windowHeight;
  const end = elementTop + elementHeight;
  const current = currentScrollY;

  if (end <= start) return 0;

  const progress = (current - start) / (end - start);
  return Math.max(0, Math.min(1, progress));
};

/**
 * 요소가 뷰포트 중앙 근처에 있는지 확인
 * @param rect 요소의 getBoundingClientRect 결과
 * @param windowHeight 윈도우 높이
 * @param threshold 중앙 근처로 간주할 임계값 (0~1)
 * @returns 중앙 근처에 있으면 true
 */
export const isNearCenter = (rect: DOMRect, windowHeight: number, threshold: number = 0.3): boolean => {
  const distance = calculateCenterDistance(rect, windowHeight);
  const maxDistance = calculateMaxDistance(rect, windowHeight);
  const normalizedDistance = distance / maxDistance;

  return normalizedDistance <= threshold;
};

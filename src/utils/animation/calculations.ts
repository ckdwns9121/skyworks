/**
 * 애니메이션 계산을 위한 순수 함수들
 */

/**
 * 부드러운 곡선(smoothstep) 함수
 * @param t 0~1 사이의 값
 * @returns 부드럽게 보간된 값
 */
export const smoothStep = (t: number): number => {
  return t * t * (3 - 2 * t);
};

/**
 * 스케일 값 계산
 * @param distance 섹션 중심과 윈도우 중심 사이의 거리
 * @param maxDistance 최대 거리
 * @param minScale 최소 스케일
 * @param maxScale 최대 스케일
 * @returns 계산된 스케일 값
 */
export const calculateScale = (distance: number, maxDistance: number, minScale: number, maxScale: number): number => {
  const norm = Math.min(distance / maxDistance, 1);
  const progress = 1 - smoothStep(norm);
  return minScale + (maxScale - minScale) * progress;
};

/**
 * 투명도 값 계산
 * @param distance 섹션 중심과 윈도우 중심 사이의 거리
 * @param maxDistance 최대 거리
 * @param minOpacity 최소 투명도
 * @param maxOpacity 최대 투명도
 * @returns 계산된 투명도 값
 */
export const calculateOpacity = (
  distance: number,
  maxDistance: number,
  minOpacity: number,
  maxOpacity: number
): number => {
  const norm = Math.min(distance / maxDistance, 1);
  const progress = 1 - smoothStep(norm);
  return minOpacity + (maxOpacity - minOpacity) * progress;
};

/**
 * 두 점 사이의 거리 계산
 * @param point1 첫 번째 점
 * @param point2 두 번째 점
 * @returns 두 점 사이의 거리
 */
export const calculateDistance = (point1: { x: number; y: number }, point2: { x: number; y: number }): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 값이 특정 범위 내에 있는지 확인하고 클램핑
 * @param value 확인할 값
 * @param min 최소값
 * @param max 최대값
 * @returns 클램핑된 값
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 선형 보간(Linear Interpolation)
 * @param start 시작값
 * @param end 끝값
 * @param t 보간 비율 (0~1)
 * @returns 보간된 값
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

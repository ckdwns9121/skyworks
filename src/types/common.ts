/**
 * 공통으로 사용하는 타입 정의
 */

/**
 * 2D 좌표점
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * 3D 좌표점
 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 크기 정보
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * DOM 요소의 위치와 크기 정보
 */
export interface DOMRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

/**
 * 애니메이션 설정
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

/**
 * 스크롤 위치 정보
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * 윈도우 크기 정보
 */
export interface WindowDimensions {
  width: number;
  height: number;
}

/**
 * 에러 정보
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  details?: unknown;
}

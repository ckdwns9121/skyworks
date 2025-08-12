/**
 * 안전한 DOM 접근을 위한 유틸리티 함수들
 */

/**
 * DOM 요소가 존재하는지 확인
 */
export const isElement = (element: unknown): element is HTMLElement => {
  return element instanceof HTMLElement;
};

/**
 * DOM 요소의 getBoundingClientRect를 안전하게 호출
 */
export const safeGetBoundingRect = (element: HTMLElement | null): DOMRect | null => {
  if (!element) return null;
  try {
    return element.getBoundingClientRect();
  } catch (error) {
    console.warn("getBoundingClientRect 호출 실패:", error);
    return null;
  }
};

/**
 * CSS 커스텀 속성을 안전하게 설정
 */
export const safeSetCSSProperty = (element: HTMLElement | null, property: string, value: string): boolean => {
  if (!element) return false;
  try {
    element.style.setProperty(property, value);
    return true;
  } catch (error) {
    console.warn(`CSS 속성 설정 실패: ${property} = ${value}`, error);
    return false;
  }
};

/**
 * DOM 요소를 안전하게 찾기
 */
export const safeQuerySelector = <T extends HTMLElement>(parent: Element | null, selector: string): T | null => {
  if (!parent) return null;
  try {
    return parent.querySelector<T>(selector);
  } catch (error) {
    console.warn(`요소 찾기 실패: ${selector}`, error);
    return null;
  }
};

/**
 * 배열의 모든 요소가 유효한지 확인
 */
export const validateRefs = <T>(refs: (T | null)[]): T[] => {
  return refs.filter((ref): ref is T => ref !== null);
};

/**
 * 윈도우 크기 정보를 안전하게 가져오기
 */
export const getWindowDimensions = () => {
  if (typeof window === "undefined") {
    console.warn(
      "window 객체를 찾을 수 없어 윈도우 크기 정보를 가져올 수 없습니다. 서버사이드 렌더링 환경일 수 있습니다."
    );
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * 스크롤 위치를 안전하게 가져오기
 */
export const getScrollPosition = () => {
  if (typeof window === "undefined") {
    console.warn(
      "window 객체를 찾을 수 없어 스크롤 위치 정보를 가져올 수 없습니다. 서버사이드 렌더링 환경일 수 있습니다."
    );
    return { x: 0, y: 0 };
  }
  return {
    x: window.scrollX,
    y: window.scrollY,
  };
};

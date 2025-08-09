import React, { useEffect, useRef, useState } from "react";
import MarqueeLogo from "../../common/MarqueeLogo";

const IMAGES_PATHS = [
  "/images/logos/logo1.png",
  "/images/logos/logo2.png",
  "/images/logos/logo3.png",
  "/images/logos/logo4.png",
  "/images/logos/logo5.png",
  "/images/logos/logo7.png",
  "/images/logos/logo8.png",
  "/images/logos/logo9.png",
  "/images/logos/logo10.png",
  "/images/logos/logo11.png",
];

export default function ClientMarqueeSection({ onDarkChange }: { onDarkChange?: (dark: boolean) => void } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgState, setBgState] = useState<"dark" | "light">("dark");
  const prevRatioRef = useRef(0);

  useEffect(() => {
    // sectionRef가 가리키는 DOM 노드를 가져옴
    const node = sectionRef.current;
    if (!node) return;

    // Intersection Observer를 생성
    // 이 옵저버는 해당 섹션이 뷰포트에 얼마나 보이는지(교차 비율)를 감지함
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        const prev = prevRatioRef.current;
        const isIncreasing = ratio > prev; // 들어오는 중인지(보이는 면적이 커지는 중인지)

        // 섹션이 완전히 뷰포트에서 사라지는 순간(끝났을 때) 무조건 dark 고정
        if (!entry.isIntersecting && prev > 0) {
          if (bgState !== "dark") {
            setBgState("dark");
            if (onDarkChange) onDarkChange(true);
          }
          prevRatioRef.current = 0;
          return;
        }

        let nextState: "dark" | "light" | null = null;
        if (isIncreasing) {
          // 아래로 스크롤하며 섹션에 진입하는 동안만 light 구간을 허용
          if (ratio >= 0.7) nextState = "dark";
          else if (ratio >= 0.2) nextState = "light";
          else nextState = "dark";
        } else {
          // 섹션을 벗어날 때는 다시 light로 바뀌지 않도록 유지
          if (ratio >= 0.7 || ratio < 0.2) nextState = "dark";
          else nextState = null; // 0.2~0.7 구간에서는 상태 변경 없음
        }

        if (nextState && nextState !== bgState) {
          setBgState(nextState);
          if (onDarkChange) onDarkChange(nextState === "dark");
        }

        prevRatioRef.current = ratio;
      },
      {
        // threshold: 0~1까지 0.01 단위로 101개 지정
        // 요소가 뷰포트에 얼마나 보이는지 세밀하게 감지하기 위함
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    // 해당 DOM 노드 관찰 시작
    observer.observe(node);

    // 컴포넌트 언마운트 시 옵저버 해제(메모리 누수 방지)
    return () => {
      observer.disconnect();
    };
  }, [onDarkChange]);

  return (
    <div
      ref={sectionRef}
      className={`h-[140vh] flex flex-col items-center justify-center transition-colors duration-700 ${
        bgState === "dark" ? "bg-[#151515] text-white" : "bg-white text-[#151515]"
      }`}
    >
      <div className="mb-2 text-center text-lg font-normal">Our Client</div>
      <div className="mb-4 text-center text-2xl md:text-3xl font-normal">
        Proudly serving global leaders for 10 years with impactful collaborations.
      </div>
      <div className="mb-1 text-center text-base font-normal opacity-80">
        우리는 다양한 분야의 제작 경험을 통해 각기 다른 장르에서도 참신하고 창의적인 콘텐츠를 만들어 내며,
      </div>
      <div className="mb-1 text-center text-base font-normal opacity-80">
        클라이언트가 기대하는 그 이상의 만족을 제공합니다.
      </div>
      <div className="mb-6 text-center text-base font-normal opacity-80">
        완성도 높은 결과물로 고객의 비전을 실현하는 종합 프로덕션입니다.
      </div>
      <MarqueeLogo images={IMAGES_PATHS} height={60} />
    </div>
  );
}

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

  useEffect(() => {
    // sectionRef가 가리키는 DOM 노드를 가져옴
    const node = sectionRef.current;
    if (!node) return;

    // Intersection Observer를 생성
    // 이 옵저버는 해당 섹션이 뷰포트에 얼마나 보이는지(교차 비율)를 감지함
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        // entry.intersectionRatio: 해당 요소가 뷰포트에 보이는 비율(0~1)
        const ratio = entry.intersectionRatio;
        let newBgState: "dark" | "light";
        // 20% 이상 70% 미만 보이면 밝은 배경(light), 그 외에는 어두운 배경(dark)으로 설정
        if (ratio >= 0.2 && ratio < 0.7) {
          newBgState = "light";
        } else {
          newBgState = "dark";
        }
        setBgState(newBgState); // 배경 상태 업데이트
        // 부모 컴포넌트에 배경이 어두운지 여부를 콜백으로 전달(옵션)
        if (onDarkChange) onDarkChange(newBgState === "dark");
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

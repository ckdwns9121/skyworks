"use client";

import React, { useRef } from "react";
import ScrollTriggerText from "@/components/sections/SpaceSection/ScrollTriggerText";
import { useThreeScene } from "@/hooks/useThreeScene";

export default function SpaceSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useThreeScene({
    mountRef,
    containerRef,
  });

  // 외부 섹션들과의 결합 제거: SpaceSection 내부에서는 비디오/클라이언트 마퀴 인덱스 계산을 하지 않음

  return (
    <div>
      <div
        ref={containerRef}
        className="relative z-10 h-[600vh] bg-[#151515] w-full font-[Pretendard,Hanken_Grotesk,-apple-system,BlinkMacSystemFont,system-ui,Roboto,Helvetica_Neue,Segoe_UI,Apple_SD_Gothic_Neo,Noto_Sans_KR,Malgun_Gothic,Apple_Color_Emoji,Segoe_UI_Emoji,Segoe_UI_Symbol,sans-serif] box-border m-0 p-0 border-0 text-[100%] align-baseline block"
        style={{
          lineHeight: 1,
        }}
      >
        {/* three.js 캔버스 */}
        <div
          ref={mountRef}
          className="sticky top-0 w-full h-screen opacity-40 pointer-events-none box-border m-0 p-0 border-0 text-[100%] align-baseline"
          style={{
            lineHeight: 1,
          }}
        />

        <div className="sticky top-[0px] w-[100vw] max-w-[1120px] mx-auto h-[100vh] flex items-center justify-center pointer-events-none box-border m-0 p-0 mt-[-30vh] border-0 text-[100%] align-baseline">
          <ScrollTriggerText
            main="(주)스카이웍스는 예술과 기술의 융합을 통해 창의적인 콘텐츠로 세상을 연결하는 영상프로덕션입니다.우리는 클라이언트의 니즈를 명확히 파악하여우리는 클라이언트의 니즈를 명확히 파악하여
                탄탄한 기획력과 현장 실행력을 바탕으로 최고의 결과물을 만듭니다."
            className="text-center text-[2.5vw] sm:text-[1.5vw] md:text-[1.8vw] leading-[1.5]"
            spreadPercent={600}
          />
        </div>
      </div>
      {/* SpaceSection은 여기까지. 이후 섹션은 페이지에서 조립 */}
    </div>
  );
}

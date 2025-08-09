"use client";

import React, { useMemo, useState } from "react";

type Feature = {
  title: string;
  description: string;
};

type Props = {
  features?: Feature[];
  ctaText?: string;
};

const DEFAULT_FEATURES: Feature[] = [
  {
    title: "Uncopyable Performance",
    description:
      "독창적인 연출과 현장 실행력을 통해 쉽게 따라할 수 없는 퍼포먼스를 만듭니다. 작은 디테일까지 설계해 당신의 브랜드만의 장면을 구축합니다.",
  },
  {
    title: "World-Class Equipment",
    description: "영화/광고급 카메라와 조명, 오디오 설비까지 완비된 파이프라인으로 안정적인 퀄리티를 보장합니다.",
  },
  {
    title: "Decade of Expertise",
    description:
      "10년 이상의 제작 경험으로 다양한 장르와 포맷에서 최적의 해법을 제시하고, 현실적인 타임라인과 예산으로 프로젝트를 완주합니다.",
  },
  {
    title: "Unstoppable Dedication",
    description:
      "끝까지 책임지는 태도로 촬영 전후를 막론하고 필요한 모든 것을 챙깁니다. 결과물이 나올 때까지 집중합니다.",
  },
];

export default function FeaturesTabSection({ features = DEFAULT_FEATURES, ctaText = "About SKYWorKS" }: Props) {
  const [active, setActive] = useState(0);
  const activeFeature = useMemo(() => features[active], [features, active]);

  return (
    <section className="bg-white text-[#151515] w-full">
      <div className="w-full pt-20 px-6 pb-10">
        <div className="text-[20px] leading-[1.5] mb-7 opacity-90">
          한 편, 두 편을 시작으로 다시 함께하고 싶은 프로덕션
        </div>

        <ul className="mt-6 mb-14 p-0 list-none border-t border-black/10">
          {features.map((f, i) => (
            <li
              key={i}
              className="relative flex items-center gap-4 h-[108px] border-b border-black/10 cursor-pointer"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span
                className={`absolute left-[-18px] w-[10px] h-[10px] rounded-full bg-[#2f5ee8] ${
                  i === active ? "visible" : "invisible"
                }`}
              />
              <span
                className={`font-medium transition-colors duration-200 ease-out text-[clamp(22px,3.2vw,36px)] ${
                  i === active ? "text-[#151515]" : "text-[#151515]/35"
                }`}
              >
                {f.title}
              </span>
            </li>
          ))}
        </ul>

        {activeFeature && (
          <p className="mt-4 text-[16px] leading-[1.65] text-[#151515]/70">{activeFeature.description}</p>
        )}

        <div className="flex justify-center mt-14">
          <button
            className="inline-flex items-center gap-[10px] rounded-full border border-[#151515] bg-white text-[#151515] px-7 py-[18px] text-[18px] leading-none transition hover:-translate-y-px"
            type="button"
          >
            {ctaText}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

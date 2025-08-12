"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Feature = {
  title: string;
  description: string;
  image: string;
};

type Props = {
  features?: Feature[];
  ctaText?: string;
};

const DEFAULT_FEATURES: Feature[] = [
  {
    title: "Uncopyable Performance",
    description: "남들을 흉내내지 않는, 카피할 수 없는 스카이웍스만의 퍼포먼스",
    image: "/images/assets/uncopy.jpg",
  },
  {
    title: "World-Class Equipment",
    description: "어설픈 장비를 취급하지 않는, 모두가 인정하는 장비 셋업.",
    image: "/images/assets/world.jpg",
  },
  {
    title: "Decade of Expertise",
    description: "10년, 전공 심화 과정부터 지금까지 우리가 달려올 수 있었던 노하우",
    image: "/images/assets/decade.jpg",
  },
  {
    title: "Unstoppable Dedication",
    description: "저희와 함께했던 순간이 보다 많은 이들에게 닿기까지 우리는 멈추지 않겠습니다.",
    image: "/images/assets/particle_blur.png",
  },
];

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return pos;
}

export default function FeaturesTabSection({ features = DEFAULT_FEATURES, ctaText = "About SKYWorKS" }: Props) {
  const [active, setActive] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [skew, setSkew] = useState(0);
  const lastX = useRef(0);
  const { x, y } = useMousePosition();

  // skew 효과: 마우스 이동 속도에 따라 skew 조정
  useEffect(() => {
    const diff = x - lastX.current;
    setSkew(Math.max(-20, Math.min(20, diff * 0.6)));
    lastX.current = x;
    // skew 점진적 복원
    const id = setTimeout(() => setSkew(0), 120);
    return () => clearTimeout(id);
  }, [x]);

  return (
    <section className="bg-white text-[#151515] w-full relative ">
      <div className="w-full pt-20 px-6 pb-10">
        <div className="text-[20px] leading-[1.5] mb-7 opacity-90">
          한 편, 두 편을 시작으로 다시 함께하고 싶은 프로덕션
        </div>

        <div className="flex gap-8">
          {/* 왼쪽 탭 영역 */}
          <div className="flex-1">
            <ul className="mt-6 mb-14 p-0 list-none border-t border-black/10">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  className={`relative border-b border-black/10 cursor-pointer transition-all duration-500 ease-out overflow-hidden ${
                    i === active ? "h-auto" : "h-[108px]"
                  }`}
                  onMouseEnter={() => {
                    setHoveredIndex(i);
                    setActive(i);
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setActive(i)}
                  whileHover={{
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="flex items-center gap-4 h-[108px]">
                    <motion.span
                      className={`font-medium transition-all duration-300 ease-out text-[clamp(22px,3.2vw,36px)] ${
                        i === active ? "text-[#151515]" : "text-[#151515]/35"
                      }`}
                      animate={{
                        color: i === active ? "#151515" : "rgba(21, 21, 21, 0.35)",
                        x: hoveredIndex === i ? 10 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {f.title}
                    </motion.span>
                  </div>

                  {/* 탭 내용 영역 */}
                  <motion.div
                    className="transition-all duration-500 ease-out"
                    initial={{ maxHeight: 0, opacity: 0, y: -20 }}
                    animate={{
                      maxHeight: i === active ? 256 : 0,
                      opacity: i === active ? 1 : 0,
                      y: i === active ? 0 : -20,
                    }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    <div className="flex gap-6 pb-6 relative">
                      {/* 영역1: 서브타이틀만 */}
                      <div className="flex-1">
                        <p className="text-[16px] leading-[1.65] text-[#151515]/70">{f.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.li>
              ))}
            </ul>

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
        </div>
      </div>

      {/* 커스텀 커서 이미지 - 참고 코드와 동일한 로직 */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            className="pointer-events-none fixed left-0 top-0 z-[2000] w-48 h-48 rounded-lg overflow-hidden bg-white shadow-[0_4px_32px_rgba(0,0,0,0.18)]"
            initial={{ opacity: 0, scale: 0.7, x: x - 96, y: y - 96, skewX: skew }}
            animate={{
              opacity: 1,
              scale: 1,
              x: x - 96,
              y: y - 96,
              skewX: skew,
            }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Image
              src={features[hoveredIndex].image}
              alt={features[hoveredIndex].title}
              fill
              className="object-cover"
              sizes="192px"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";

type TitleTickerProps = {
  items: string[];
  activeIndex: number;
  heightClass?: string; // tailwind height class for each row
  textClass?: string; // tailwind text class for typography
};

export default function TitleTicker({
  items,
  activeIndex,
  heightClass = "h-[56px] md:h-[72px]",
  textClass = "text-4xl md:text-6xl font-semibold text-[#aaa] text-center",
}: TitleTickerProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [rowHeight, setRowHeight] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      if (rowRef.current) {
        setRowHeight(rowRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${heightClass} w-full`}
      style={{ perspective: 900, height: rowHeight || undefined }}
    >
      <div
        className="transition-transform duration-500 ease-out will-change-transform [transform-style:preserve-3d]"
        style={{ transform: `translateY(-${activeIndex * (rowHeight || 0)}px)` }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            className={`${heightClass} flex items-center justify-center w-full`}
            ref={i === 0 ? rowRef : undefined}
          >
            <span className={textClass}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import React from "react";
import styles from "./TextMarqueeSection.module.css";

type TextMarqueeSectionProps = {
  heightVh?: number;
  text?: string;
};

const DEFAULT_TEXT = "About SKYWorKS";

export default function TextMarqueeSection({ heightVh = 60, text = DEFAULT_TEXT }: TextMarqueeSectionProps) {
  // 텍스트 + 아이콘 조합을 넉넉히 반복해서 양쪽에서 흘러가도록 구성
  const sequence = new Array(8).fill(null).map((_, i) => (
    <span key={i} className={styles.item}>
      <Image src="/file.svg" alt="star" width={36} height={36} className={styles.star} />
      <span className="text-[8vw] leading-none font-normal">{text}</span>
    </span>
  ));

  return (
    <section className={`${styles.section}`} style={{ height: `${heightVh}vh` }} data-marquee-section>
      {/* 위 라인: 왼쪽으로 흐름 */}
      <div className={`${styles.marquee} h-1/2 flex items-center border-b border-black/5`}>
        <div className={`${styles.track} ${styles.animateLeft}`}>
          {sequence}
          {sequence}
        </div>
      </div>

      {/* 아래 라인: 오른쪽으로 흐름 */}
      <div className={`${styles.marquee} h-1/2 flex items-center`}>
        <div className={`${styles.track} ${styles.animateRight}`}>
          {sequence}
          {sequence}
        </div>
      </div>
    </section>
  );
}

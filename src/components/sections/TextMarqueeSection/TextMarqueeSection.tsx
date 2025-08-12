"use client";

import Image from "next/image";
import React from "react";
import styles from "./TextMarqueeSection.module.css";

type TextMarqueeSectionProps = {
  heightVh?: number;
  text?: string;
};

const DEFAULT_TEXT = "About SKYWorKS";

export default function TextMarqueeSection({ heightVh = 30, text = DEFAULT_TEXT }: TextMarqueeSectionProps) {
  // 텍스트 + 아이콘 조합을 넉넉히 반복해서 왼쪽에서 흘러가도록 구성
  const sequence = new Array(8).fill(null).map((_, i) => (
    <span key={i} className={styles.item}>
      <Image
        src="/ico_main_article.svg"
        alt="star"
        width={80}
        height={80}
        className={`${styles.star} ${styles.rotating}`}
      />
      <span className="text-[4vw] leading-none font-normal">{text}</span>
    </span>
  ));

  return (
    <section className={`${styles.section}`} style={{ height: `${heightVh}vh` }} data-marquee-section>
      {/* 마퀴: 가운데 정렬 */}
      <div className={`${styles.marquee} h-full flex items-center justify-center`}>
        <div className={`${styles.track} ${styles.animateLeft}`}>
          {sequence}
          {sequence}
        </div>
      </div>
    </section>
  );
}

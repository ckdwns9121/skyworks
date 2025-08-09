"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollTriggerText.module.css";

gsap.registerPlugin(ScrollTrigger);

export type ScrollTriggerTextProps = {
  main: string;
  className?: string;
  showMarkers?: boolean;
  startPosition?: string;
  endPosition?: string;
  scrubEffect?: boolean;
  /** 전체 텍스트가 채워지는 데 사용할 스크롤 분포 폭(단위: viewport %) - 값이 클수록 더 천천히 채워짐 */
  spreadPercent?: number;
};

export default function ScrollTriggerText({
  main,
  className,
  showMarkers = false,
  startPosition = "center 150%",
  endPosition = "center 0%",
  scrubEffect = true,
  spreadPercent = 200,
}: ScrollTriggerTextProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // 기존 ScrollTrigger 제거
    ScrollTrigger.getAll().forEach((trigger) => {
      if (charRefs.current.includes(trigger.trigger as HTMLSpanElement)) {
        trigger.kill();
      }
    });

    if (textRef.current && charRefs.current.length > 0) {
      const count = charRefs.current.length;
      // 가변 분배: 전체 스크롤 분포를 글자 수에 맞춰 0~spreadPercent% 안에 균등 배치
      // (spreadPercent를 키울수록 전체 채움 속도가 느려짐)
      const step = spreadPercent / Math.max(count, 1);

      charRefs.current.forEach((el, i) => {
        if (!el) return;

        const startOffset = i * step;
        const endOffset = startOffset + step * 0.9; // 각 글자 구간 대부분을 사용하여 부드럽게 채움

        const scrollTriggerConfig: ScrollTrigger.Vars = {
          trigger: textRef.current,
          start: `top+=${startOffset}% bottom`,
          end: `top+=${endOffset}% bottom`,
          scrub: scrubEffect,
          markers: showMarkers,
        };

        gsap.to(el, {
          opacity: 1,
          ease: "none",
          scrollTrigger: scrollTriggerConfig,
        });
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 ScrollTrigger 정리
      ScrollTrigger.getAll().forEach((trigger) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (charRefs.current.includes(trigger.trigger as HTMLSpanElement)) {
          trigger.kill();
        }
      });
    };
  }, [showMarkers, startPosition, endPosition, scrubEffect, main, spreadPercent]);

  return (
    <h1 ref={textRef} className={`${styles.text} ${className}`}>
      {main.split("").map((char, i) => (
        <span
          key={i}
          className={styles.char}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

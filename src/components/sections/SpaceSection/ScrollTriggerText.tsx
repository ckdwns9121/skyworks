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
};

export default function ScrollTriggerText({
  main,
  className,
  showMarkers = false,
  startPosition = "center 150%",
  endPosition = "center 0%",
  scrubEffect = true,
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
      charRefs.current.forEach((el, i) => {
        if (!el) return;

        const scrollTriggerConfig: ScrollTrigger.Vars = {
          trigger: textRef.current,
          start: `top+=${i * 20}% bottom`,
          end: `top+=${i * 20 + 10}% bottom`,
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
  }, [showMarkers, startPosition, endPosition, scrubEffect, main]);

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

"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TextClipEffect.module.css";

gsap.registerPlugin(ScrollTrigger);

export type TextClipEffectItemProps = {
  main: string;
  className?: string;
  showMarkers?: boolean;
  startPosition?: string;
  endPosition?: string;
  scrubEffect?: boolean;
};

export default function TextClipEffectItem({
  main,
  className,
  showMarkers = false,
  startPosition = "center 100%",
  endPosition = "center 0%",
  scrubEffect = true,
}: TextClipEffectItemProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // 기존 ScrollTrigger 제거
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === textRef.current) {
          trigger.kill();
        }
      });

      gsap.to(textRef.current, {
        backgroundSize: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: textRef.current,
          start: startPosition,
          end: endPosition,
          scrub: scrubEffect,
          markers: showMarkers,
        },
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 ScrollTrigger 정리
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === textRef.current) {
          trigger.kill();
        }
      });
    };
  }, [showMarkers, startPosition, endPosition, scrubEffect]);

  return (
    <h1 ref={textRef} className={`${styles.text} ${className}`}>
      {main}
    </h1>
  );
}

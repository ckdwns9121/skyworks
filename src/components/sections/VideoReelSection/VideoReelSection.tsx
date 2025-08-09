"use client";

import React, { useEffect, useRef, useState } from "react";
import StickyNav from "@/components/common/StickyNav";
import VideoScale from "@/components/common/VideoScale";
import styles from "./VideoReelSection.module.css";
import Image from "next/image";

export type VideoItem = { src: string; text: string };

type VideoReelSectionProps = {
  videos: VideoItem[];
  dark?: boolean;
};

export default function VideoReelSection({ videos, dark = false }: VideoReelSectionProps) {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const windowCenter = window.innerHeight / 2;
      let minDist = Infinity;
      let idx = 0;
      videoRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - windowCenter);
        if (dist < minDist) {
          minDist = dist;
          idx = i;
        }
      });
      setCurrentVideoIdx(idx);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} className={styles.wrapper} data-video-reel>
      <StickyNav titles={videos.map((v) => v.text)} index={currentVideoIdx} total={videos.length} />
      {videos.map((item, idx) => (
        <VideoScale
          key={idx}
          videoSrc={item.src}
          text={item.text}
          index={idx}
          dark={dark}
          ref={(el) => {
            if (el) {
              videoRefs.current[idx] = el;
            }
          }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full">
        여기여기
        <Image src="/logo.svg" alt="logo" width={131} height={20} />
      </div>
    </div>
  );
}

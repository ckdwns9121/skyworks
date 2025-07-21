import React from "react";
import styles from "./MarqueeLogo.module.css";

interface MarqueeLogoProps {
  images: string[];
  height?: number;
}

export default function MarqueeLogo({ images, height = 60 }: MarqueeLogoProps) {
  // 이미지를 두 번 반복해서 무한 루프처럼 보이게 함
  const marqueeImages = [...images, ...images];
  return (
    <div className={styles.marqueeWrapper} style={{ height }}>
      <div className={styles.marqueeTrack}>
        {marqueeImages.map((src, idx) => (
          <div className={styles.logoItem} key={idx} style={{ height }}>
            <img src={src} alt="logo" style={{ height: "100%", maxWidth: 160, objectFit: "contain" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

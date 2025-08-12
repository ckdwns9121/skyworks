import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { safeGetBoundingRect, getWindowDimensions } from "@/utils/domUtils";

interface VideoScaleProps {
  videoSrc: string;
  text: string;
  index: number;
  dark?: boolean;
}

const MAX_SCALE = 1.45;
const MIN_SCALE = 0.8;

const VideoScale = forwardRef<HTMLDivElement, VideoScaleProps>(({ videoSrc, text, index, dark = false }, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [opacity, setOpacity] = useState(0.3);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const loop = () => {
      try {
        if (!sectionRef.current) {
          console.warn("섹션 ref가 없습니다.");
          return;
        }

        const rect = safeGetBoundingRect(sectionRef.current);
        if (!rect) {
          console.warn("섹션의 위치 정보를 가져올 수 없습니다.");
          return;
        }

        const { height: windowHeight } = getWindowDimensions();
        if (windowHeight === 0) {
          console.warn("윈도우 높이 정보를 가져올 수 없습니다.");
          return;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        const distance = Math.abs(sectionCenter - windowCenter);
        const maxDistance = windowHeight / 2 + rect.height / 2;
        const norm = Math.min(distance / maxDistance, 1); // 0..1

        // 부드러운 곡선(smoothstep)으로 진행률 변환
        const smooth = (t: number) => t * t * (3 - 2 * t);
        const progress = 1 - smooth(norm); // 중앙에서 1, 바깥에서 0

        const s = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * progress;
        setScale(s);
        setOpacity(0.3 + 0.7 * progress); // 0.3 ~ 1.0 범위로 부드럽게
      } catch (error) {
        console.error("애니메이션 루프 실행 중 오류 발생:", error);
        setError("애니메이션 계산 중 오류가 발생했습니다.");
        // 에러 발생 시 기본값으로 복원
        setScale(MIN_SCALE);
        setOpacity(0.3);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const onResize = () => {
      // 리사이즈 시 추가 로직이 필요하다면 여기에 구현
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ref 연결 - 안전한 타입 가드 추가
  useImperativeHandle(
    ref,
    () => {
      if (!sectionRef.current) {
        throw new Error("VideoScale ref가 아직 준비되지 않았습니다.");
      }
      return sectionRef.current;
    },
    []
  );

  // 에러가 발생한 경우 사용자에게 알림
  if (error) {
    console.error("VideoScale 오류:", error);
    // 프로덕션에서는 사용자 친화적인 에러 UI를 표시할 수 있습니다
  }

  return (
    <div
      ref={sectionRef}
      className="h-[120vh] flex flex-col items-center justify-center relative transition-colors duration-700"
      style={{
        zIndex: 10,
        background: "transparent",
        color: dark ? "#fff" : "#151515",
        transition: "background 0.7s cubic-bezier(0.4,0,0.2,1), color 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        className="flex items-center justify-center w-full"
        style={{
          transform: `scale(${scale})`,
          opacity,
          transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 1,
          willChange: "transform, opacity",
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-xl shadow-lg w-[70vw] max-w-4xl h-[60vh] object-cover"
          style={{ background: "#222" }}
          onError={(e) => {
            console.error(`비디오 로드 실패: ${videoSrc}`, e);
            setError(`비디오 로드에 실패했습니다: ${text}`);
          }}
        />
      </div>
    </div>
  );
});

VideoScale.displayName = "VideoScale";

export default VideoScale;

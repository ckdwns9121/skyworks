import { forwardRef, useImperativeHandle } from "react";
import { useVideoScale } from "@/hooks/animation/useVideoScale";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

interface VideoScaleProps {
  videoSrc: string;
  text: string;
  index: number;
  dark?: boolean;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

const VideoScale = forwardRef<HTMLDivElement, VideoScaleProps>(
  (
    { videoSrc, text, index, dark = false, minScale = 0.8, maxScale = 1.45, minOpacity = 0.3, maxOpacity = 1.0 },
    ref
  ) => {
    // useVideoScale 훅을 사용하여 애니메이션 로직 분리
    const {
      scale,
      opacity,
      error,
      isAnimating,
      ref: sectionRef,
    } = useVideoScale({
      minScale,
      maxScale,
      minOpacity,
      maxOpacity,
      centerThreshold: 0.3,
      updateInterval: 16, // 60fps
    });

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
      return (
        <div className="h-[120vh] flex flex-col items-center justify-center">
          <ErrorDisplay error={error} variant="card" onRetry={() => window.location.reload()} />
        </div>
      );
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
            willChange: isAnimating ? "transform, opacity" : "auto", // 애니메이션 중일 때만 willChange 적용
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
            }}
          />
        </div>
      </div>
    );
  }
);

VideoScale.displayName = "VideoScale";

export default VideoScale;

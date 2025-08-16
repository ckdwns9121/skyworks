"use client";

import { ReactNode, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "./PageTransition";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  "data-cursor-hover"?: string;
  target?: string;
  rel?: string;
  title?: string;
  id?: string;
}

export default function TransitionLink({ href, children, className = "", onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const { startTransition, isTransitioning } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 이미 트랜지션 중이거나 같은 페이지라면 무시
    if (isTransitioning || window.location.pathname === href) {
      return;
    }

    // 외부 링크인 경우 바로 이동
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.open(href, "_blank");
      return;
    }

    // 커스텀 onClick 핸들러가 있다면 실행
    if (onClick) {
      onClick(e);
    }

    // 페이지 트랜지션 시작
    startTransition(href, () => {
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      className={`${className} ${isTransitioning ? "pointer-events-none opacity-50" : ""}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

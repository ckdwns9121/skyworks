"use client";

import { ReactNode, MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { startTransition, isTransitioning } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 외부 링크는 브라우저의 기본 동작에 맡겨 `target` 속성을 존중하도록 합니다.
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    e.preventDefault();

    // 이미 트랜지션 중이거나 같은 페이지라면 무시
    if (isTransitioning || pathname === href) {
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

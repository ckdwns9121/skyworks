"use client";

import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-[300] bg-transparent">
      <div className="mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        <Link href="#" className="inline-flex items-center gap-2 select-none">
          <Image
            src="/logo.svg"
            alt="SKYWoRKS"
            width={131}
            height={20}
            priority
            className="block mix-blend-difference"
          />
        </Link>

        <nav className="flex items-center gap-8 text-base md:text-lg font-semibold mix-blend-difference text-white">
          <Link className="hover:opacity-80 transition-opacity" href="#about">
            About
          </Link>
          <Link className="hover:opacity-80 transition-opacity inline-flex items-baseline gap-1" href="#work">
            <span>Work</span>
            <sup className="text-[10px] md:text-xs leading-none align-super">47</sup>
          </Link>
          <Link className="hover:opacity-80 transition-opacity" href="#service">
            Service
          </Link>
          <Link className="hover:opacity-80 transition-opacity" href="#contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

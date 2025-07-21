import React from "react";

interface StickyNavProps {
  title: string;
  index: number;
  total: number;
}

export default function StickyNav({ title, index, total }: StickyNavProps) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 32px",
        color: "#aaa",
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: 0.5,
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 18, color: "#aaa" }}>Work</span>
      <span style={{ fontSize: 40, color: "#aaa", fontWeight: 600 }}>{title}</span>
      <span style={{ fontSize: 18, color: "#aaa" }}>
        ({index + 1} / {total})
      </span>
    </nav>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MiniPin } from "./MiniMapCanvas";

const MiniMapCanvas = dynamic(() => import("./MiniMapCanvas"), { ssr: false });

/** Holds the space and only builds the map once it is nearly on screen, so
 *  six small maps don't all pull tiles at once on load. */
export function MiniMap({
  pins,
  lines,
  className = "",
  padding,
  dashed,
}: {
  pins: MiniPin[];
  lines: [number, number][][];
  className?: string;
  padding?: number;
  dashed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const on = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bg-surface-2 ${className}`}>
      {show && (
        <MiniMapCanvas
          pins={pins}
          lines={lines}
          dark={dark}
          padding={padding}
          dashed={dashed}
        />
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/** Fixed per position so the pile looks hand-dropped but never reshuffles. */
const POSE = [
  { r: 0, x: 0, y: 0 },
  { r: 3.2, x: 15, y: 10 },
  { r: -2.8, x: -12, y: 18 },
  { r: 1.8, x: 8, y: 24 },
];

const SWIPE_DISTANCE = 55;
const SWIPE_VELOCITY = 0.35;

/** A pile of prints. Drag or tap the top one to send it to the back.
 *  With a single photo it is just a print, no interaction. */
export function PhotoStack({
  images,
  alt,
  caption,
  href,
  tilt = 0,
}: {
  images: string[];
  alt: string;
  caption: string;
  href?: string;
  tilt?: number;
}) {
  const [order, setOrder] = useState(() => images.map((_, i) => i));
  const [drag, setDrag] = useState(0);
  const [flying, setFlying] = useState(false);
  const start = useRef<{ x: number; t: number } | null>(null);
  const multi = images.length > 1;

  const advance = (direction: number) => {
    setFlying(true);
    setDrag(direction * 420);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setFlying(false);
      setDrag(0);
    }, 240);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!multi || flying) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, t: e.timeStamp };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    setDrag(e.clientX - start.current.x);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dt = Math.max(1, e.timeStamp - start.current.t);
    start.current = null;

    // A quick flick counts even when it did not travel far
    if (Math.abs(dx) > SWIPE_DISTANCE || Math.abs(dx) / dt > SWIPE_VELOCITY) {
      advance(Math.sign(dx) || 1);
    } else {
      setDrag(0);
      // A tap on the top card also moves the pile along
      if (Math.abs(dx) < 4 && e.timeStamp - 0 > 0) advance(1);
    }
  };

  return (
    <div className="relative" style={{ paddingBottom: multi ? 44 : 0 }}>
      <div className="relative">
        {order
          .map((imageIndex, position) => ({ imageIndex, position }))
          .reverse()
          .map(({ imageIndex, position }) => {
            const pose = POSE[Math.min(position, POSE.length - 1)];
            const isTop = position === 0;
            const offset = isTop ? drag : 0;

            return (
              <div
                key={imageIndex}
                className={position === 0 ? "relative" : "absolute inset-0"}
                style={{
                  zIndex: images.length - position,
                  transform: `translate(${pose.x + offset}px, ${pose.y}px) rotate(${
                    pose.r + tilt + offset * 0.03
                  }deg)`,
                  opacity: isTop && flying ? 0 : 1,
                  transition: start.current
                    ? "none"
                    : "transform 320ms var(--ease-out), opacity 240ms ease",
                  touchAction: multi ? "pan-y" : undefined,
                  cursor: isTop && multi ? "grab" : undefined,
                }}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? () => setDrag(0) : undefined}
              >
                <div className="print">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[3px]">
                    <Image
                      src={images[imageIndex]}
                      alt={isTop ? alt : ""}
                      fill
                      draggable={false}
                      sizes="(max-width: 640px) 90vw, 262px"
                      className="object-cover select-none"
                    />
                  </div>
                  <p className="hand pt-2 pb-0.5 text-center text-[15px] text-ink-3">
                    {caption}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {multi && (
        <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-3">
          <div className="flex gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                aria-hidden
                className="h-1.5 w-1.5 rounded-full transition-colors duration-200"
                style={{
                  background:
                    order[0] === i ? "var(--ink-3)" : "var(--line-strong)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => advance(1)}
            className="press text-[13px] text-ink-3 hover:text-ink-2"
          >
            {images.length} billeder
          </button>
        </div>
      )}

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="sr-only focus:not-sr-only"
        >
          Åbn {caption}
        </a>
      )}
    </div>
  );
}

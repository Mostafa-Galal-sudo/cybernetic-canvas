import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsSmall } from "@/components/SpineColumn";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type SpineCardProps = {
  index: number;
  children: ReactNode;
  className?: string;
  onSettled?: () => void;
};

/**
 * A card slotted next to the central SpineColumn.
 * - Desktop: alternates left/right of the spine, with a nerve-root connector to the centerline.
 * - Mobile: stacks centered, single column.
 * - Animates in via GSAP ScrollTrigger (scrub), then drifts in a slow float loop.
 */
export function SpineCard({ index, children, className = "", onSettled }: SpineCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<gsap.core.Tween | null>(null);
  const settledCbRef = useRef(onSettled);
  settledCbRef.current = onSettled;
  const isSmall = useIsSmall();
  const even = index % 2 === 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const ctx = gsap.context(() => {
      gsap.set(card, {
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
        willChange: "transform, opacity, filter",
      });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          end: "top 50%",
          scrub: 1.2,
          onLeave: () => {
            if (!floatRef.current) {
              floatRef.current = gsap.to(card, {
                y: -4,
                repeat: -1,
                yoyo: true,
                duration: 3,
                ease: "sine.inOut",
              });
              settledCbRef.current?.();
            }
          },
        },
      });
    }, wrap);

    return () => {
      floatRef.current?.kill();
      floatRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={
          isSmall
            ? "mx-auto w-full max-w-md px-1"
            : even
              ? "absolute left-[4%] w-[42%]"
              : "absolute right-[4%] w-[42%]"
        }
      >
        {/* Nerve-root connector (desktop only) */}
        {!isSmall && (
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-px w-[60px]"
            style={{
              [even ? "right" : "left"]: "-60px",
              background: even
                ? "linear-gradient(to left, oklch(0.85 0.18 200 / 0.7), transparent)"
                : "linear-gradient(to right, oklch(0.85 0.18 200 / 0.7), transparent)",
            }}
          />
        )}
        <div ref={cardRef} className={`will-change-transform ${className}`}>
          {children}
        </div>
      </div>
      {/* Spacer to give absolute card a row in the flow on desktop */}
      {!isSmall && <div className="invisible">{children}</div>}
    </div>
  );
}

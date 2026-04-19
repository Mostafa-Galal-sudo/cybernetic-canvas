import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/components/HelixSpine";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type HelixCardProps = {
  index: number;
  children: ReactNode;
  className?: string;
  /** Horizontal offset magnitude in px (desktop). Default 300. */
  offset?: number;
  onSwingComplete?: () => void;
};

/**
 * A card slot that:
 * - Sits offset left/right of the central HelixSpine on desktop (alternating by index)
 * - Stacks centered on mobile
 * - Swings into view via GSAP scrub-linked ScrollTrigger
 * - Fires `onSwingComplete` once the swing has fully resolved
 */
export function HelixCard({
  index,
  children,
  className = "",
  offset = 300,
  onSwingComplete,
}: HelixCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const isMobile = useIsMobile();
  const even = index % 2 === 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.set(card, { opacity: 0, y: 40, x: 0, rotateY: 0, filter: "blur(4px)" });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 85%",
            end: "top 50%",
            scrub: 1.4,
            onUpdate: (self) => {
              if (self.progress >= 0.98 && !completedRef.current) {
                completedRef.current = true;
                onSwingComplete?.();
              }
            },
          },
        });
      } else {
        gsap.set(card, {
          opacity: 0,
          x: even ? -60 : 60,
          rotateY: even ? -30 : 30,
          filter: "blur(8px)",
          transformPerspective: 900,
        });
        gsap.to(card, {
          opacity: 1,
          x: 0,
          rotateY: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 80%",
            end: "top 40%",
            scrub: 1.4,
            onUpdate: (self) => {
              if (self.progress >= 0.98 && !completedRef.current) {
                completedRef.current = true;
                onSwingComplete?.();
              }
            },
          },
        });
      }
    }, wrap);

    return () => ctx.revert();
  }, [even, isMobile, onSwingComplete]);

  // Compute layout offset for the OUTER wrapper (so GSAP's `x` on the inner card stays free)
  const desktopOffset = isMobile ? 0 : even ? -offset : offset;

  return (
    <div
      ref={wrapRef}
      className="relative flex w-full justify-center"
      style={{ perspective: "1200px" }}
    >
      <div
        className="w-full sm:max-w-md"
        style={{ transform: `translateX(${desktopOffset}px)` }}
      >
        <div
          ref={cardRef}
          className={`will-change-transform [transform-style:preserve-3d] ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

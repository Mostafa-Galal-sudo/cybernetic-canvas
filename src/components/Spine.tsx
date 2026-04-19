import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type SpineProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Vertical glowing backbone.
 * - Scroll-scrubbed scaleY draw (top→bottom)
 * - Cyan→violet→magenta gradient
 * - Box-shadow glow
 *
 * Mobile: anchored to left edge (left-4)
 * Desktop (sm+): centered (left-1/2)
 */
export const Spine = forwardRef<HTMLDivElement, SpineProps>(function Spine(
  { children, className = "" },
  _ref,
) {
  const lineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-0 h-full w-px bg-border/40 sm:left-1/2 sm:-translate-x-1/2"
      >
        <div
          ref={lineRef}
          className="h-full w-full origin-top bg-gradient-to-b from-cyber-cyan via-cyber-violet to-cyber-magenta"
          style={{ boxShadow: "0 0 14px var(--cyber-cyan)" }}
        />
      </div>
      {children}
    </div>
  );
});

type SpineNodeProps = { index?: number };

/**
 * Pulsing node dot anchored to the spine.
 * Use inside a `relative` parent with `pl-10 sm:pl-0` layout.
 */
export function SpineNode({ index = 0 }: SpineNodeProps) {
  return (
    <div className="absolute left-4 top-5 -translate-x-1/2 sm:left-1/2 z-10">
      <span
        className="absolute -inset-2 rounded-full border border-cyber-cyan/25 animate-ping"
        style={{ animationDuration: "2.5s", animationDelay: `${index * 0.3}s` }}
      />
      <span className="absolute -inset-1 rounded-full border border-cyber-cyan/20" />
      <div className="grid h-4 w-4 place-items-center rounded-full bg-background ring-2 ring-cyber-cyan relative">
        <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-pulse" />
      </div>
    </div>
  );
}

type SpineCardProps = {
  index: number;
  children: ReactNode;
  className?: string;
  /** Called once when the card has fully swung into view. */
  onSwingComplete?: () => void;
};

/**
 * 3D-swing card attached to the spine.
 * - Even index: rendered on the LEFT, swings from rotateY -90° (mobile -45°)
 * - Odd index:  rendered on the RIGHT, swings from rotateY +90° (mobile +45°)
 * - Scrub-linked per card (scrub: 1.5)
 * - Settles with a subtle floating loop after first full swing.
 */
export function SpineCard({
  index,
  children,
  className = "",
  onSwingComplete,
}: SpineCardProps) {
  const right = index % 2 === 1;
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches;
    const startRotY = right ? (isMobile ? 45 : 90) : isMobile ? -45 : -90;

    const ctx = gsap.context(() => {
      gsap.set(card, {
        rotateY: startRotY,
        z: -60,
        opacity: 0,
        filter: "blur(6px)",
        transformPerspective: 1200,
      });

      gsap.to(card, {
        rotateY: 0,
        z: 60,
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          end: "top 40%",
          scrub: 1.5,
          onUpdate: (self) => {
            if (self.progress >= 0.98 && !completedRef.current) {
              completedRef.current = true;
              // Idle float after swing completes
              gsap.to(card, {
                y: -6,
                repeat: -1,
                yoyo: true,
                duration: 3,
                ease: "sine.inOut",
              });
              onSwingComplete?.();
            }
          },
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [right, onSwingComplete]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ perspective: "1200px" }}
    >
      <SpineNode index={index} />
      <div
        className={`sm:w-1/2 ${
          right ? "sm:ml-auto sm:pl-12" : "sm:pr-12"
        } pl-10 sm:pl-0`}
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

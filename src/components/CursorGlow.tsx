import { useEffect, useRef } from "react";

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let isHover = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      }
      const target = e.target as HTMLElement | null;
      const hover = !!target?.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]');
      if (hover !== isHover) {
        isHover = hover;
        if (ringRef.current) {
          ringRef.current.dataset.hover = hover ? "true" : "false";
        }
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 rounded-full bg-cyber-cyan md:block"
        style={{
          boxShadow: "0 0 14px var(--cyber-cyan), 0 0 30px var(--cyber-cyan)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ringRef}
        data-hover="false"
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-8 w-8 rounded-full border border-cyber-cyan/60 transition-[width,height,border-color,opacity] duration-200 data-[hover=true]:h-12 data-[hover=true]:w-12 data-[hover=true]:border-cyber-violet/90 md:block"
        style={{ boxShadow: "0 0 30px oklch(0.85 0.18 200 / 0.3)" }}
      />
    </>
  );
}

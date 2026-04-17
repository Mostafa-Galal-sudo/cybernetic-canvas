import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  intensity?: number;
};

export const TiltCard = forwardRef<HTMLDivElement, Props>(function TiltCard(
  { children, className, intensity = 10, ...rest },
  _ref,
) {
  const innerRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -intensity * 2;
    const ry = (px - 0.5) * intensity * 2;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(0,0,0)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={innerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "relative will-change-transform transition-transform duration-200 [transform-style:preserve-3d]",
        className,
      )}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx) var(--my), oklch(0.85 0.18 200 / 0.18), transparent 45%)",
        }}
      />
      {children}
    </div>
  );
});

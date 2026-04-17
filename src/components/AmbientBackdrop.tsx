import { useEffect, useRef } from "react";

/**
 * Fixed full-viewport canvas: cyber grid + drifting particles.
 * Cheap, GPU-friendly, reduced-motion aware.
 */
export function AmbientBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let width = 0;
    let height = 0;
    let raf = 0;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const PARTICLE_COUNT = isMobile ? 38 : 90;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let particles: P[] = [];

    const seed = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.4,
        hue: Math.random() < 0.55 ? 200 : 290,
      }));
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let t = 0;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Grid
      const cell = 60;
      const offset = (t * 8) % cell;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "oklch(0.55 0.08 240 / 0.08)";
      ctx.beginPath();
      for (let x = -cell + offset; x < width; x += cell) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = -cell + offset; y < height; y += cell) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Particles
      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `oklch(0.85 0.2 ${p.hue} / 0.85)`);
        grd.addColorStop(1, `oklch(0.85 0.2 ${p.hue} / 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
      <div className="absolute inset-0 scanline opacity-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.65 0.25 290 / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, oklch(0.85 0.18 200 / 0.14) 0%, transparent 55%)",
        }}
      />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Lock, Coffee, Sword, Cpu, Trophy, Bug, BookOpen, Network, Code2, ScanLine } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mostafa Galal" },
      {
        name: "description",
        content:
          "The neural map of Mostafa Galal — engineer, red teamer, eJPT certified — and the connections that shape how he works.",
      },
      { property: "og:title", content: "About — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "A neural map of Mostafa Galal's principles, skills, and projects.",
      },
    ],
  }),
  component: AboutPage,
});

type Node = {
  id: string;
  label: string;
  sub: string;
  group: "skill" | "value" | "project";
  Icon: typeof Shield;
  // unit-coords from the center (-1..1)
  x: number;
  y: number;
};

const NODES: Node[] = [
  // Values (top arc)
  { id: "ethics",   label: "Ethics first",  sub: "Disclose responsibly. Always.", group: "value", Icon: Shield,  x: -0.55, y: -0.85 },
  { id: "curious",  label: "Curious",       sub: "If it runs, I want to know how.", group: "value", Icon: Brain,   x:  0.00, y: -1.00 },
  { id: "method",   label: "Methodical",    sub: "Recon → enum → exploit → report.", group: "value", Icon: Lock,    x:  0.55, y: -0.85 },
  { id: "persist",  label: "Persistent",    sub: "Three TryHackMe seasons #1.", group: "value", Icon: Coffee,  x:  0.95, y: -0.10 },

  // Skills (left/right arc)
  { id: "offense",  label: "Offensive Sec", sub: "eJPT — web, network, AD.",   group: "skill", Icon: Sword,   x: -1.00, y: -0.10 },
  { id: "embed",    label: "Embedded",      sub: "Smart Recon Vehicle, HC-05.", group: "skill", Icon: Cpu,     x: -0.95, y:  0.45 },
  { id: "rev",      label: "Reverse Eng",   sub: "x86, ELF, Ghidra, radare2.",  group: "skill", Icon: Code2,   x:  0.85, y:  0.45 },
  { id: "recon",    label: "Recon",         sub: "Nmap, subfinder, custom TCP.", group: "skill", Icon: ScanLine, x:  0.95, y:  0.10 },

  // Projects (bottom arc)
  { id: "snap",     label: "Snapchat SMTP", sub: "Open relay — disclosed.",     group: "project", Icon: Bug,     x: -0.55, y:  0.85 },
  { id: "shadow",   label: "Shadow Core",   sub: "Modular delivery framework.", group: "project", Icon: Network, x:  0.00, y:  1.00 },
  { id: "thm",      label: "TryHackMe #1",  sub: "Sapphire 0.8% Epic.",         group: "project", Icon: Trophy,  x:  0.55, y:  0.85 },
  { id: "study",    label: "CCE Eng",       sub: "Filters, RLC, embedded.",     group: "project", Icon: BookOpen, x:  -0.95, y: 0.85 },
];

const GROUP_COLOR: Record<Node["group"], string> = {
  skill:   "oklch(0.85 0.18 200)", // cyan
  value:   "oklch(0.65 0.25 290)", // violet
  project: "oklch(0.7 0.27 330)",  // magenta
};

function AboutPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 700 });
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  const rx = Math.min(size.w * 0.42, 360);
  const ry = Math.min(size.h * 0.4, 300);

  const project = (n: Node) => ({ x: cx + n.x * rx, y: cy + n.y * ry });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-cyan" />
            neural::map
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyber-cyan" />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            The synapses behind <span className="text-gradient-cyber">how I work</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            I'm Mostafa Mohamed Galal — Communications & Electronics Engineering student, eJPT-certified red teamer.
            Hover any node to read the connection.
          </p>
        </div>
      </Reveal>

      <div
        ref={wrapRef}
        className="relative mx-auto mt-12 aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-3xl glass-panel gradient-border"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.18 0.04 270 / 0.6), oklch(0.1 0.02 265 / 0.85))",
        }}
      >
        {/* faint grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(var(--cyber-grid) 1px, transparent 1px), linear-gradient(90deg, var(--cyber-grid) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 75%)",
          }}
        />

        <svg
          width={size.w}
          height={size.h}
          className="absolute inset-0"
          aria-hidden
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.85 0.18 200 / 0.9)" />
              <stop offset="60%" stopColor="oklch(0.65 0.25 290 / 0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.85 0.18 200 / 0.9)" />
              <stop offset="100%" stopColor="oklch(0.65 0.25 290 / 0.3)" />
            </linearGradient>
          </defs>

          {/* center halo */}
          <circle cx={cx} cy={cy} r={120} fill="url(#centerGlow)" opacity={0.55} />

          {/* connections */}
          {NODES.map((n, i) => {
            const p = project(n);
            const active = hover === n.id;
            return (
              <g key={`line-${n.id}`}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke="url(#lineGrad)"
                  strokeWidth={active ? 1.6 : 0.8}
                  opacity={active ? 0.95 : 0.45}
                  strokeDasharray="4 6"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-40"
                    dur={`${5 + (i % 4)}s`}
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const p = project(n);
            const color = GROUP_COLOR[n.group];
            const active = hover === n.id;
            return (
              <g key={`node-${n.id}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 10 : 6}
                  fill={color}
                  opacity={0.9}
                  style={{ filter: `drop-shadow(0 0 ${active ? 14 : 6}px ${color})`, transition: "all 200ms ease" }}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 18 : 12}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.5}
                />
              </g>
            );
          })}
        </svg>

        {/* center avatar */}
        <div
          className="pointer-events-none absolute z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: cx, top: cy }}
        >
          <div className="grid h-28 w-28 place-items-center rounded-full glass-panel gradient-border">
            <span className="font-display text-3xl font-bold text-gradient-cyber">MG</span>
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-cyan">
            mostafa_galal
          </div>
        </div>

        {/* node labels (HTML so they're crisp) */}
        {NODES.map((n) => {
          const p = project(n);
          const Icon = n.Icon;
          const color = GROUP_COLOR[n.group];
          const active = hover === n.id;
          // anchor labels outward
          const offX = n.x === 0 ? 0 : n.x > 0 ? 18 : -18;
          const offY = n.y < -0.5 ? -20 : n.y > 0.5 ? 20 : 0;
          const transform = `translate(${
            n.x === 0 ? "-50%" : n.x > 0 ? "0%" : "-100%"
          }, ${
            n.y === 0 ? "-50%" : n.y < 0 ? "-100%" : "0%"
          })`;
          return (
            <button
              key={`label-${n.id}`}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              className="absolute z-20 text-left"
              style={{ left: p.x + offX, top: p.y + offY, transform }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-lg px-3 py-2 glass-panel gradient-border"
                style={{
                  boxShadow: active
                    ? `0 0 28px ${color}`
                    : `0 0 0 transparent`,
                  transition: "box-shadow 220ms ease",
                  minWidth: 140,
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                  <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color }}>
                    {n.label}
                  </span>
                </div>
                <div className="mt-1 text-[11px] leading-tight text-muted-foreground">
                  {n.sub}
                </div>
              </motion.div>
            </button>
          );
        })}

        {/* legend */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            {(["value", "skill", "project"] as const).map((g) => (
              <span key={g} className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: GROUP_COLOR[g], boxShadow: `0 0 8px ${GROUP_COLOR[g]}` }} />
                {g}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-glow rounded-full bg-cyber-cyan" />
            online
          </span>
        </div>
      </div>

      {/* short bio under the map */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
        {[
          "I balance a heavy Communications & Electronics Engineering curriculum with self-directed offensive security work — eJPT certified, three #1 finishes on TryHackMe leaderboards, and a Snapchat SMTP open relay disclosed responsibly.",
          "Hands-on across both worlds: a Smart Recon Vehicle, Butterworth band-pass filters, the Shadow Core Framework, NM Analyzer, a Payload Research Toolkit, and a custom TCP scanner.",
          "If a system is worth attacking, it's worth doing it well — methodically, ethically, with an engineer's understanding of the hardware and software underneath.",
        ].map((line, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <p>{line}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

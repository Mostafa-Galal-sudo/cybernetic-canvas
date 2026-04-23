import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Brain, Lock, Sword, Cpu, Trophy, Bug,
  BookOpen, Network, Code2, ScanLine,
  Play, Pause, SkipForward, RotateCcw, Eye, Activity,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mostafa Galal" },
      { name: "description", content: "Neural inspector — Mostafa Galal's principles, skills and projects modeled as a feedforward network you can step through." },
      { property: "og:title", content: "About — Mostafa Galal" },
      { property: "og:description", content: "Step through a feedforward neural model of how Mostafa Galal works." },
    ],
  }),
  component: AboutPage,
});

type Group = "input" | "value" | "skill" | "output";
type Mode  = "viz" | "sim" | "debug";

type Node = {
  id:    string;
  label: string;
  sub:   string;
  group: Group;
  Icon:  typeof Shield;
  layer: 0 | 1 | 2 | 3;
  act:   "relu" | "sigmoid" | "linear";
  bias:  number;
};

type Edge = { from: string; to: string; w: number };

/* Colors — hex only, full browser compat (no oklch) */
const GROUP_HEX: Record<Group, string> = {
  input:  "#f59e0b",
  value:  "#8b5cf6",
  skill:  "#00d4c8",
  output: "#e040ab",
};

const NODES: Node[] = [
  { id: "cce",     label: "CCE Eng",       sub: "Comm & Electronics curriculum",     group: "input",  Icon: BookOpen, layer: 0, act: "linear",  bias: 0.85 },
  { id: "iti",     label: "ITI Cyber",     sub: "90h cybersecurity track",            group: "input",  Icon: Shield,   layer: 0, act: "linear",  bias: 0.78 },
  { id: "thm",     label: "TryHackMe",     sub: "3x #1 leaderboard",                 group: "input",  Icon: Trophy,   layer: 0, act: "linear",  bias: 0.92 },
  { id: "lab",     label: "Home Lab",      sub: "AD lab, VMs, target boxes",          group: "input",  Icon: Network,  layer: 0, act: "linear",  bias: 0.70 },
  { id: "ethics",  label: "Ethics first",  sub: "Disclose responsibly. Always.",      group: "value",  Icon: Shield,   layer: 1, act: "sigmoid", bias: 0.20 },
  { id: "method",  label: "Methodical",    sub: "Recon to enum to exploit to report", group: "value",  Icon: Lock,     layer: 1, act: "relu",    bias: 0.10 },
  { id: "curious", label: "Curious",       sub: "If it runs, I want to know how.",   group: "value",  Icon: Brain,    layer: 1, act: "relu",    bias: 0.15 },
  { id: "offense", label: "Offensive Sec", sub: "eJPT — web, network, AD.",           group: "skill",  Icon: Sword,    layer: 2, act: "relu",    bias: 0.00 },
  { id: "recon",   label: "Recon",         sub: "Nmap, subfinder, custom TCP.",       group: "skill",  Icon: ScanLine, layer: 2, act: "relu",    bias: 0.00 },
  { id: "rev",     label: "Reverse Eng",   sub: "x86, ELF, Ghidra, radare2.",         group: "skill",  Icon: Code2,    layer: 2, act: "relu",    bias: 0.00 },
  { id: "embed",   label: "Embedded",      sub: "Smart Recon Vehicle, HC-05.",        group: "skill",  Icon: Cpu,      layer: 2, act: "relu",    bias: 0.00 },
  { id: "snap",    label: "Snapchat SMTP", sub: "Open relay — disclosed.",            group: "output", Icon: Bug,      layer: 3, act: "sigmoid", bias: 0.00 },
  { id: "shadow",  label: "Shadow Core",   sub: "Modular delivery framework.",        group: "output", Icon: Network,  layer: 3, act: "sigmoid", bias: 0.00 },
  { id: "nm",      label: "NM Analyzer",   sub: "ELF symbol heuristics.",             group: "output", Icon: ScanLine, layer: 3, act: "sigmoid", bias: 0.00 },
  { id: "vehicle", label: "Recon Vehicle", sub: "Embedded BT-controlled rover.",      group: "output", Icon: Cpu,      layer: 3, act: "sigmoid", bias: 0.00 },
];

/* Typed explicitly — no `as never`, no `as any` */
const EDGES: Edge[] = [
  { from: "cce",     to: "method",  w: 0.70 },
  { from: "cce",     to: "curious", w: 0.60 },
  { from: "iti",     to: "ethics",  w: 0.90 },
  { from: "iti",     to: "method",  w: 0.80 },
  { from: "thm",     to: "method",  w: 0.70 },
  { from: "thm",     to: "curious", w: 0.85 },
  { from: "lab",     to: "curious", w: 0.70 },
  { from: "lab",     to: "method",  w: 0.60 },
  { from: "ethics",  to: "offense", w: 0.60 },
  { from: "ethics",  to: "recon",   w: 0.70 },
  { from: "method",  to: "offense", w: 0.85 },
  { from: "method",  to: "recon",   w: 0.90 },
  { from: "method",  to: "rev",     w: 0.70 },
  { from: "method",  to: "embed",   w: 0.60 },
  { from: "curious", to: "rev",     w: 0.85 },
  { from: "curious", to: "embed",   w: 0.80 },
  { from: "curious", to: "offense", w: 0.70 },
  { from: "offense", to: "snap",    w: 0.85 },
  { from: "recon",   to: "snap",    w: 0.90 },
  { from: "offense", to: "shadow",  w: 0.80 },
  { from: "recon",   to: "shadow",  w: 0.60 },
  { from: "rev",     to: "nm",      w: 0.95 },
  { from: "offense", to: "nm",      w: 0.50 },
  { from: "embed",   to: "vehicle", w: 0.95 },
];

const LAYER_LABELS: Record<number, string> = {
  0: "inputs", 1: "values", 2: "skills", 3: "outputs",
};

function activate(z: number, fn: Node["act"]): number {
  if (fn === "relu")    return Math.max(0, z);
  if (fn === "sigmoid") return 1 / (1 + Math.exp(-6 * (z - 0.5)));
  return Math.max(0, Math.min(1, z));
}

function AboutPage() {
  const wrapRef                       = useRef<HTMLDivElement>(null);
  const [size, setSize]               = useState({ w: 900, h: 580 });
  const [mode, setMode]               = useState<Mode>("viz");
  const [step, setStep]               = useState(0);
  const [playing, setPlaying]         = useState(false);
  const [hover, setHover]             = useState<string | null>(null);
  const [selected, setSelected]       = useState<string | null>(null);
  const [epoch, setEpoch]             = useState(0);
  const [edgeWeights, setEdgeWeights] = useState<Edge[]>(EDGES);

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

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= 3) { setPlaying(false); return 3; }
        return s + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, [playing]);

  const positions = useMemo(() => {
    const padX = 80;
    const padY = 52;
    const colW = (size.w - padX * 2) / 3;
    const map  = new Map<string, { x: number; y: number }>();
    ([0, 1, 2, 3] as const).forEach((L) => {
      const layer = NODES.filter((n) => n.layer === L);
      const rowH  = (size.h - padY * 2) / Math.max(layer.length - 1, 1);
      layer.forEach((n, i) => {
        map.set(n.id, {
          x: padX + L * colW,
          y: layer.length === 1 ? size.h / 2 : padY + i * rowH,
        });
      });
    });
    return map;
  }, [size]);

  const activations = useMemo(() => {
    const a = new Map<string, number>();
    NODES.forEach((n) => { a.set(n.id, n.layer === 0 ? n.bias : 0); });
    for (let L = 1; L <= Math.min(step, 3); L++) {
      NODES.filter((n) => n.layer === L).forEach((t) => {
        const incoming = edgeWeights.filter((e) => e.to === t.id);
        const z =
          incoming.reduce((acc, e) => acc + (a.get(e.from) ?? 0) * e.w, 0) /
          Math.max(incoming.length, 1) + t.bias;
        a.set(t.id, activate(z, t.act));
      });
    }
    return a;
  }, [step, edgeWeights]);

  const reset    = () => { setStep(0); setPlaying(false); };
  const stepOnce = () => setStep((s) => Math.min(3, s + 1));

  /* Weight clamped to [0, 1] — no negative weights */
  const train = () => {
    setEdgeWeights((ws) =>
      ws.map((e) => ({
        ...e,
        w: Math.min(1, Math.max(0, e.w + (Math.random() - 0.45) * 0.04)),
      }))
    );
    setEpoch((e) => e + 1);
  };

  const selectedNode = selected ? (NODES.find((n) => n.id === selected) ?? null) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">

      {/* HEADER */}
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-cyan" aria-hidden />
            neural::inspector
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyber-cyan" aria-hidden />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            A feedforward model of{" "}
            <span className="text-gradient-cyber">how I work</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            I'm Mostafa Mohamed Galal — Communications & Electronics Engineering student,
            eJPT-certified red teamer. Below is my mental network:{" "}
            <span className="text-foreground">step the inference</span>, watch signals
            propagate, and inspect any node.
          </p>
        </div>
      </Reveal>

      {/* CONTROL BAR */}
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 glass-panel gradient-border">
        <div className="flex items-center gap-1" role="group" aria-label="Visualization mode">
          {(["viz", "sim", "debug"] as const).map((m) => {
            const Icon   = m === "viz" ? Eye : m === "sim" ? Activity : Bug;
            const labels = { viz: "visualize", sim: "simulate", debug: "debug" } as const;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                  mode === m
                    ? "bg-cyber-cyan/15 text-cyber-cyan ring-1 ring-cyber-cyan/40"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3 w-3" aria-hidden />
                {labels[m]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">layer</span>
            <span className="rounded bg-black/40 px-2 py-0.5 text-cyber-cyan ring-1 ring-cyber-cyan/30">
              {step} / 3
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">epoch</span>
            <span className="rounded bg-black/40 px-2 py-0.5 text-cyber-violet ring-1 ring-cyber-violet/30">
              {epoch}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={reset} aria-label="Reset simulation"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause forward pass" : "Play forward pass"}
            className="grid h-8 w-8 place-items-center rounded-md text-cyber-cyan transition-all hover:bg-cyber-cyan/10">
            {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
          </button>
          <button onClick={stepOnce} aria-label="Step one layer"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
            <SkipForward className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button onClick={train} aria-label="Run one training epoch"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyber-violet/30 to-cyber-cyan/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground ring-1 ring-cyber-violet/30 transition-all hover:from-cyber-violet/50 hover:to-cyber-cyan/50">
            <Activity className="h-3 w-3" aria-hidden />
            train
          </button>
        </div>
      </div>

      {/* CANVAS + INSPECTOR */}
      <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1fr_300px]">

        {/* network canvas */}
        <div
          ref={wrapRef}
          role="img"
          aria-label="Interactive feedforward neural network diagram: 4 layers — inputs, values, skills, outputs"
          className="relative h-[580px] w-full overflow-hidden rounded-3xl glass-panel gradient-border"
          style={{ background: "radial-gradient(ellipse at 50% 45%, #0d1a2d 0%, #060b14 100%)" }}
        >
          {/* dot-grid texture */}
          <svg width={size.w} height={size.h}
            className="pointer-events-none absolute inset-0 opacity-[0.065]" aria-hidden>
            <defs>
              <pattern id="dot-grid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.9" fill="#00d4c8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>

          {/* scanlines */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,200,0.7) 2px, rgba(0,212,200,0.7) 3px)" }}
            aria-hidden />

          {/* corner brackets */}
          {(["top-3 left-3 border-l border-t", "top-3 right-3 border-r border-t",
             "bottom-3 left-3 border-l border-b", "bottom-3 right-3 border-r border-b"] as const
          ).map((cls, i) => (
            <div key={i} className={cn("pointer-events-none absolute h-5 w-5 border-cyber-cyan/25", cls)} aria-hidden />
          ))}

          {/* layer labels */}
          {([0, 1, 2, 3] as const).map((L) => {
            const x     = 80 + L * ((size.w - 160) / 3);
            const group = (["input", "value", "skill", "output"] as const)[L];
            return (
              <div key={L}
                className="pointer-events-none absolute -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em]"
                style={{ left: x, top: 14, color: `${GROUP_HEX[group]}55` }}
                aria-hidden>
                L{L} · {LAYER_LABELS[L]}
              </div>
            );
          })}

          {/* SVG — edges + pulses */}
          <svg width={size.w} height={size.h} className="absolute inset-0" aria-hidden>
            <defs>
              <linearGradient id="edgeBase" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#00d4c8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#00d4c8" stopOpacity="1" />
                <stop offset="100%" stopColor="#e040ab" stopOpacity="1" />
              </linearGradient>
              <filter id="edge-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {edgeWeights.map((e, i) => {
              const a     = positions.get(e.from);
              const b     = positions.get(e.to);
              if (!a || !b) return null;
              const fromN = NODES.find((n) => n.id === e.from);
              const toN   = NODES.find((n) => n.id === e.to);
              if (!fromN || !toN) return null;

              const isActive      = mode !== "viz" && step >= toN.layer && step >= fromN.layer + 1;
              const sigStrength   = (activations.get(e.from) ?? 0) * e.w;
              const isHighlighted = hover === e.from || hover === e.to || selected === e.from || selected === e.to;
              const cx1 = a.x + (b.x - a.x) * 0.45;
              const cx2 = a.x + (b.x - a.x) * 0.55;
              const d   = `M ${a.x} ${a.y} C ${cx1} ${a.y}, ${cx2} ${b.y}, ${b.x} ${b.y}`;
              const sw  = isHighlighted ? 2.0 : 0.5 + e.w * 2.0;

              return (
                <g key={`edge-${e.from}-${e.to}-${i}`}>
                  {isActive && (
                    <path d={d} fill="none" stroke="url(#edgeActive)"
                      strokeWidth={sw + 5} opacity={0.10} filter="url(#edge-glow)" />
                  )}
                  <path d={d} fill="none"
                    stroke={isActive ? "url(#edgeActive)" : "url(#edgeBase)"}
                    strokeWidth={sw}
                    opacity={isActive ? 0.5 + sigStrength * 0.5 : isHighlighted ? 0.65 : 0.13}
                    style={{ transition: "opacity 350ms ease, stroke-width 350ms ease" }}
                  />
                  {isActive && sigStrength > 0.04 && (
                    <circle r={2.8} fill="#00d4c8" opacity={0.95} filter="url(#pulse-glow)">
                      <animateMotion dur="1.1s" repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                  {mode === "debug" && (
                    <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 5}
                      fontSize="8.5" fontFamily="monospace"
                      fill="#00d4c8" fillOpacity="0.75" textAnchor="middle">
                      {e.w.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML nodes */}
          {NODES.map((n) => {
            const p   = positions.get(n.id);
            if (!p) return null;
            const Icon      = n.Icon;
            const hex       = GROUP_HEX[n.group];
            const a         = activations.get(n.id) ?? 0;
            const lit       = mode !== "viz" && step >= n.layer;
            const intensity = mode === "viz" ? 0.65 : lit ? 0.3 + a * 0.7 : 0.18;
            const isSel     = selected === n.id;
            const isHov     = hover    === n.id;

            return (
              <button
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected((s) => (s === n.id ? null : n.id))}
                aria-pressed={isSel}
                aria-label={`${n.label}: ${n.sub}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/60"
                style={{ left: p.x, top: p.y }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative"
                    style={{
                      filter: `drop-shadow(0 0 ${isSel ? 18 : isHov ? 11 : 3 + intensity * 9}px ${hex}${isSel ? "dd" : isHov ? "88" : "44"})`,
                      transition: "filter 250ms ease",
                    }}>
                    <div className="grid h-14 w-14 place-items-center rounded-xl"
                      style={{
                        background:  "linear-gradient(145deg, #0e1829 0%, #101e33 100%)",
                        border:      `1.5px solid ${hex}${isSel ? "cc" : isHov ? "77" : "38"}`,
                        boxShadow:   `inset 0 0 ${8 + intensity * 16}px ${hex}1a`,
                        transition:  "border-color 250ms ease, box-shadow 250ms ease",
                      }}>
                      <Icon className="h-5 w-5"
                        style={{ color: hex, opacity: 0.35 + intensity * 0.65 }} aria-hidden />
                      {mode !== "viz" && (
                        <svg className="pointer-events-none absolute inset-0" viewBox="0 0 56 56" aria-hidden>
                          <circle cx="28" cy="28" r="25" fill="none"
                            stroke={hex} strokeWidth="1.5"
                            strokeDasharray={`${a * 157} 157`}
                            strokeLinecap="round" transform="rotate(-90 28 28)"
                            opacity={0.75}
                            style={{ transition: "stroke-dasharray 400ms ease" }} />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-wider transition-all duration-200"
                    style={{
                      color:      hex,
                      opacity:    isHov || isSel ? 1 : 0.50,
                      textShadow: isHov || isSel ? `0 0 8px ${hex}77` : "none",
                    }}>
                    {n.label}
                  </div>
                  {mode === "debug" && (
                    <div className="font-mono text-[8.5px] text-muted-foreground">
                      a={a.toFixed(2)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* legend */}
          <div className="pointer-events-none absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground" aria-hidden>
            <div className="flex flex-wrap items-center gap-3">
              {(["input","value","skill","output"] as const).map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full"
                    style={{ background: GROUP_HEX[g], boxShadow: `0 0 5px ${GROUP_HEX[g]}` }} />
                  {g}
                </span>
              ))}
            </div>
            <span className="opacity-40">{NODES.length} units · {edgeWeights.length} edges · fwd-pass</span>
          </div>
        </div>

        {/* INSPECTOR PANEL */}
        <div className="flex flex-col overflow-hidden rounded-3xl glass-panel gradient-border">
          {/* terminal title bar */}
          <div className="flex shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-5 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60"    />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60"  />
            </div>
            <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              inspector
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                        style={{
                          background: `${GROUP_HEX[selectedNode.group]}14`,
                          border:     `1px solid ${GROUP_HEX[selectedNode.group]}40`,
                        }}>
                        <selectedNode.Icon className="h-4 w-4"
                          style={{ color: GROUP_HEX[selectedNode.group] }} aria-hidden />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold leading-tight">
                          {selectedNode.label}
                        </h3>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {selectedNode.group} · L{selectedNode.layer}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {selectedNode.sub}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-wider">
                    {([
                      { label: "act fn", value: selectedNode.act,                                  color: "text-foreground" },
                      { label: "bias",   value: selectedNode.bias.toFixed(2),                       color: "text-foreground" },
                      { label: "a(x)",   value: (activations.get(selectedNode.id) ?? 0).toFixed(3), color: "text-cyber-cyan" },
                      { label: "layer",  value: `L${selectedNode.layer}`,                          color: "text-foreground" },
                    ] as const).map(({ label, value, color }) => (
                      <div key={label} className="rounded-lg bg-black/35 p-3">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className={cn("mt-1 font-semibold", color)}>{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div>
                    <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      incoming weights
                    </div>
                    <ul className="space-y-2.5">
                      {edgeWeights
                        .filter((e) => e.to === selectedNode.id)
                        .sort((a, b) => b.w - a.w)
                        .map((e) => {
                          const f = NODES.find((n) => n.id === e.from);
                          if (!f) return null;
                          return (
                            <li key={e.from} className="flex items-center justify-between gap-2">
                              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: GROUP_HEX[f.group] }} aria-hidden />
                                {f.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-14 overflow-hidden rounded-full bg-black/50">
                                  <div className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width:      `${e.w * 100}%`,
                                      background: "linear-gradient(90deg, #00d4c8, #8b5cf6)",
                                    }} />
                                </div>
                                <span className="w-9 font-mono text-[10px] tabular-nums text-cyber-cyan">
                                  {e.w.toFixed(2)}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      {edgeWeights.filter((e) => e.to === selectedNode.id).length === 0 && (
                        <li className="font-mono text-[10px] text-muted-foreground">— input layer —</li>
                      )}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Select any node to inspect its activation, bias, and incoming weights.
                  </p>
                  <ul className="space-y-2 font-mono text-[11px]">
                    <li><span className="text-cyber-cyan">visualize </span><span className="text-muted-foreground">— clean static graph.</span></li>
                    <li><span className="text-cyber-cyan">simulate  </span><span className="text-muted-foreground">— pulse signals layer by layer.</span></li>
                    <li><span className="text-cyber-cyan">debug     </span><span className="text-muted-foreground">— show weights & activations.</span></li>
                  </ul>
                  <div className="rounded-xl bg-black/40 p-4 font-mono text-[10px] ring-1 ring-white/[0.05]">
                    <div className="mb-1.5 text-cyber-cyan">model.summary()</div>
                    <div className="space-y-0.5 text-muted-foreground">
                      <div>params &nbsp;: {edgeWeights.length} weights</div>
                      <div>units &nbsp;&nbsp;: {NODES.length}</div>
                      <div>arch &nbsp;&nbsp;&nbsp;: feedforward (4L)</div>
                      <div>epoch &nbsp;&nbsp;: {epoch}</div>
                      <div className="mt-1 text-[9px] opacity-35">loss: ego_decay = 0.0</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* BIO SECTION */}
      <div className="mx-auto mt-20 max-w-4xl">
        <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-cyan">
          <span className="opacity-40">// </span>bio.txt
        </div>
        <div className="overflow-hidden rounded-2xl ring-1 ring-white/[0.07]">
          {[
            {
              n: "01",
              text: "I balance a heavy Communications & Electronics Engineering curriculum with self-directed offensive security work — eJPT certified, three #1 finishes on TryHackMe, and a Snapchat SMTP open relay disclosed responsibly.",
            },
            {
              n: "02",
              text: "Hands-on across both worlds: Smart Recon Vehicle, Butterworth band-pass filters, the Shadow Core Framework, NM Analyzer, a Payload Research Toolkit, and a custom TCP scanner.",
            },
            {
              n: "03",
              text: "If a system is worth attacking, it's worth doing it well — methodically, ethically, with an engineer's understanding of the hardware and software underneath.",
            },
          ].map((line, i) => (
            <Reveal key={line.n} delay={i * 0.08}>
              <div className={cn(
                "flex gap-5 bg-black/20 px-6 py-5 text-base leading-relaxed transition-colors duration-200 hover:bg-black/35",
                i < 2 && "border-b border-white/[0.05]",
              )}>
                <span className="mt-1 shrink-0 font-mono text-[10px] text-cyber-cyan/45">{line.n}</span>
                <p className="text-foreground/80">{line.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

    </div>
  );
}

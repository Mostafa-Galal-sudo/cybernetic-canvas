import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Brain, Lock, Sword, Cpu, Trophy, Bug, BookOpen, Network, Code2, ScanLine,
  Play, Pause, SkipForward, RotateCcw, Eye, Activity, Bug as DebugIcon,
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

/* ─────────────────────────────────────────────────────────────────
   The model — 4 layers, feedforward.
   Layer 0  inputs       (raw experience / coursework / curiosity)
   Layer 1  values       (principles)
   Layer 2  capabilities (skills)
   Layer 3  outputs      (projects / outcomes)
   ───────────────────────────────────────────────────────────────── */

type Group = "input" | "value" | "skill" | "output";

type Node = {
  id: string;
  label: string;
  sub: string;
  group: Group;
  Icon: typeof Shield;
  layer: 0 | 1 | 2 | 3;
  /** activation fn — visual only */
  act: "relu" | "sigmoid" | "linear";
  /** baseline activation 0..1 */
  bias: number;
};

type Edge = { from: string; to: string; w: number };

const NODES: Node[] = [
  // L0 inputs
  { id: "cce",    label: "CCE Eng",      sub: "Comm & Electronics curriculum",     group: "input", Icon: BookOpen, layer: 0, act: "linear",  bias: 0.85 },
  { id: "iti",    label: "ITI Cyber",    sub: "90h cybersecurity track",            group: "input", Icon: Shield,   layer: 0, act: "linear",  bias: 0.78 },
  { id: "thm",    label: "TryHackMe",    sub: "3× #1 leaderboard",                  group: "input", Icon: Trophy,   layer: 0, act: "linear",  bias: 0.92 },
  { id: "lab",    label: "Home Lab",     sub: "AD lab, VMs, target boxes",          group: "input", Icon: Network,  layer: 0, act: "linear",  bias: 0.7  },

  // L1 values / principles
  { id: "ethics",  label: "Ethics first", sub: "Disclose responsibly. Always.",     group: "value", Icon: Shield,   layer: 1, act: "sigmoid", bias: 0.2 },
  { id: "method",  label: "Methodical",   sub: "Recon → enum → exploit → report.",  group: "value", Icon: Lock,     layer: 1, act: "relu",    bias: 0.1 },
  { id: "curious", label: "Curious",      sub: "If it runs, I want to know how.",   group: "value", Icon: Brain,    layer: 1, act: "relu",    bias: 0.15 },

  // L2 capabilities
  { id: "offense", label: "Offensive Sec",sub: "eJPT — web, network, AD.",          group: "skill", Icon: Sword,    layer: 2, act: "relu",    bias: 0.0 },
  { id: "recon",   label: "Recon",        sub: "Nmap, subfinder, custom TCP.",      group: "skill", Icon: ScanLine, layer: 2, act: "relu",    bias: 0.0 },
  { id: "rev",     label: "Reverse Eng",  sub: "x86, ELF, Ghidra, radare2.",        group: "skill", Icon: Code2,    layer: 2, act: "relu",    bias: 0.0 },
  { id: "embed",   label: "Embedded",     sub: "Smart Recon Vehicle, HC-05.",       group: "skill", Icon: Cpu,      layer: 2, act: "relu",    bias: 0.0 },

  // L3 outputs
  { id: "snap",    label: "Snapchat SMTP",sub: "Open relay — disclosed.",           group: "output", Icon: Bug,     layer: 3, act: "sigmoid", bias: 0.0 },
  { id: "shadow",  label: "Shadow Core",  sub: "Modular delivery framework.",       group: "output", Icon: Network, layer: 3, act: "sigmoid", bias: 0.0 },
  { id: "nm",      label: "NM Analyzer",  sub: "ELF symbol heuristics.",            group: "output", Icon: ScanLine,layer: 3, act: "sigmoid", bias: 0.0 },
  { id: "vehicle", label: "Recon Vehicle",sub: "Embedded BT-controlled rover.",     group: "output", Icon: Cpu,     layer: 3, act: "sigmoid", bias: 0.0 },
];

// Hand-tuned weights — meaningful, not random.
const EDGES: Edge[] = [
  // inputs → values
  ["cce","method",0.7],["cce","curious",0.6],
  ["iti","ethics",0.9],["iti","method",0.8],
  ["thm","method",0.7],["thm","curious",0.85],
  ["lab","curious",0.7],["lab","method",0.6],

  // values → skills
  ["ethics","offense",0.6],["ethics","recon",0.7],
  ["method","offense",0.85],["method","recon",0.9],["method","rev",0.7],["method","embed",0.6],
  ["curious","rev",0.85],["curious","embed",0.8],["curious","offense",0.7],

  // skills → outputs
  ["offense","snap",0.85],["recon","snap",0.9],
  ["offense","shadow",0.8],["recon","shadow",0.6],
  ["rev","nm",0.95],["offense","nm",0.5],
  ["embed","vehicle",0.95],["curious" as never,"vehicle" as never,0] as never,
].filter(Boolean).map((e: any) => ({ from: e[0], to: e[1], w: e[2] }));

const GROUP_COLOR: Record<Group, string> = {
  input:  "oklch(0.78 0.15 75)",   // amber
  value:  "oklch(0.65 0.25 290)",  // violet
  skill:  "oklch(0.85 0.18 200)",  // cyan
  output: "oklch(0.7 0.27 330)",   // magenta
};

type Mode = "viz" | "sim" | "debug";

function activate(z: number, fn: Node["act"]) {
  if (fn === "relu") return Math.max(0, z);
  if (fn === "sigmoid") return 1 / (1 + Math.exp(-6 * (z - 0.5)));
  return Math.max(0, Math.min(1, z));
}

function AboutPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 900, h: 560 });
  const [mode, setMode] = useState<Mode>("viz");
  const [step, setStep] = useState(0);          // 0..3 (which layer is "lit")
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [epoch, setEpoch] = useState(0);
  const [edgeWeights, setEdgeWeights] = useState<Edge[]>(EDGES);

  // measure
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

  // autoplay
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          setPlaying(false);
          return 3;
        }
        return s + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, [playing]);

  /* layout: column per layer, evenly spaced rows */
  const positions = useMemo(() => {
    const cols = 4;
    const padX = 70;
    const padY = 40;
    const colW = (size.w - padX * 2) / (cols - 1);
    const map = new Map<string, { x: number; y: number }>();
    [0, 1, 2, 3].forEach((L) => {
      const layerNodes = NODES.filter((n) => n.layer === L);
      const rowH = (size.h - padY * 2) / Math.max(layerNodes.length - 1, 1);
      layerNodes.forEach((n, i) => {
        map.set(n.id, {
          x: padX + L * colW,
          y: layerNodes.length === 1 ? size.h / 2 : padY + i * rowH,
        });
      });
    });
    return map;
  }, [size]);

  /* compute activations for current step */
  const activations = useMemo(() => {
    const a = new Map<string, number>();
    NODES.forEach((n) => {
      if (n.layer === 0) a.set(n.id, n.bias);
      else a.set(n.id, 0);
    });
    // propagate up to current step
    for (let L = 1; L <= Math.min(step, 3); L++) {
      const targets = NODES.filter((n) => n.layer === L);
      targets.forEach((t) => {
        const incoming = edgeWeights.filter((e) => e.to === t.id);
        const z = incoming.reduce((acc, e) => acc + (a.get(e.from) ?? 0) * e.w, 0) / Math.max(incoming.length, 1) + t.bias;
        a.set(t.id, activate(z, t.act));
      });
    }
    return a;
  }, [step, edgeWeights]);

  const reset = () => { setStep(0); setPlaying(false); };
  const stepOnce = () => setStep((s) => Math.min(3, s + 1));
  const train = () => {
    // tiny visual "training": nudge weights slightly toward 1 along strongest path
    setEdgeWeights((ws) =>
      ws.map((e) => ({ ...e, w: Math.min(1, e.w + (Math.random() - 0.45) * 0.04) }))
    );
    setEpoch((e) => e + 1);
  };

  const selectedNode = selected ? NODES.find((n) => n.id === selected) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-cyan" />
            neural::inspector
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyber-cyan" />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            A feedforward model of <span className="text-gradient-cyber">how I work</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            I'm Mostafa Mohamed Galal — Communications & Electronics Engineering student, eJPT-certified red teamer.
            Below is my mental network: <span className="text-foreground">step the inference</span>, watch signals propagate,
            and inspect any node's weights.
          </p>
        </div>
      </Reveal>

      {/* control bar */}
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 glass-panel gradient-border">
        <div className="flex items-center gap-1">
          {(["viz","sim","debug"] as const).map((m) => {
            const Icon = m === "viz" ? Eye : m === "sim" ? Activity : DebugIcon;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                  mode === m
                    ? "bg-cyber-cyan/15 text-cyber-cyan ring-1 ring-cyber-cyan/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                {m === "viz" ? "visualize" : m === "sim" ? "simulate" : "debug"}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-muted-foreground">layer</span>
          <span className="rounded bg-black/40 px-2 py-0.5 text-cyber-cyan ring-1 ring-cyber-cyan/30">
            {step} / 3
          </span>
          <span className="text-muted-foreground">epoch</span>
          <span className="rounded bg-black/40 px-2 py-0.5 text-cyber-violet ring-1 ring-cyber-violet/30">
            {epoch}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={reset}
            title="Reset"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            title={playing ? "Pause" : "Play forward pass"}
            className="grid h-8 w-8 place-items-center rounded-md text-cyber-cyan transition-all hover:bg-cyber-cyan/10"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={stepOnce}
            title="Step one layer"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={train}
            title="Train (visual)"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyber-violet/30 to-cyber-cyan/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground ring-1 ring-cyber-violet/30 transition-all hover:from-cyber-violet/50 hover:to-cyber-cyan/50"
          >
            <Activity className="h-3 w-3" />
            train
          </button>
        </div>
      </div>

      {/* canvas + inspector grid */}
      <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1fr_320px]">
        <div
          ref={wrapRef}
          className="relative h-[560px] w-full overflow-hidden rounded-3xl glass-panel gradient-border"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.16 0.04 270 / 0.6), oklch(0.09 0.02 265 / 0.95))",
          }}
        >
          {/* layer rails / labels */}
          {(["input","value","skill","output"] as const).map((g, i) => {
            const x = 70 + i * ((size.w - 140) / 3);
            return (
              <div
                key={g}
                className="pointer-events-none absolute -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60"
                style={{ left: x, top: 12 }}
              >
                L{i} · {g}
              </div>
            );
          })}

          <svg width={size.w} height={size.h} className="absolute inset-0" aria-hidden>
            <defs>
              <linearGradient id="edgeBase" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.85 0.18 200 / 0.55)" />
                <stop offset="100%" stopColor="oklch(0.65 0.25 290 / 0.55)" />
              </linearGradient>
              <linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.9 0.2 200 / 1)" />
                <stop offset="100%" stopColor="oklch(0.7 0.27 330 / 1)" />
              </linearGradient>
            </defs>

            {/* edges */}
            {edgeWeights.map((e, i) => {
              const a = positions.get(e.from);
              const b = positions.get(e.to);
              if (!a || !b) return null;
              const fromN = NODES.find((n) => n.id === e.from)!;
              const toN = NODES.find((n) => n.id === e.to)!;
              const isActive = mode !== "viz" && step >= toN.layer && step >= fromN.layer + 1;
              const sigStrength = (activations.get(e.from) ?? 0) * e.w;
              const isHover = hover === e.from || hover === e.to;
              const cx1 = a.x + (b.x - a.x) * 0.5;
              const cy1 = a.y;
              const cx2 = a.x + (b.x - a.x) * 0.5;
              const cy2 = b.y;
              const d = `M ${a.x} ${a.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.x} ${b.y}`;
              return (
                <g key={`${e.from}-${e.to}-${i}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke={isActive ? "url(#edgeActive)" : "url(#edgeBase)"}
                    strokeWidth={isHover ? 2 : 0.5 + e.w * 1.6}
                    opacity={isActive ? 0.6 + sigStrength * 0.4 : isHover ? 0.7 : 0.18}
                    style={{ transition: "all 300ms ease" }}
                  />
                  {/* signal pulse in sim/debug */}
                  {isActive && sigStrength > 0.05 && (
                    <circle r={2.4} fill="oklch(0.95 0.15 200)" opacity={0.9}>
                      <animateMotion dur="1.2s" repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                  {/* debug weight label */}
                  {mode === "debug" && (
                    <text
                      x={(a.x + b.x) / 2}
                      y={(a.y + b.y) / 2 - 4}
                      fontSize="9"
                      fontFamily="monospace"
                      fill="oklch(0.85 0.18 200 / 0.85)"
                      textAnchor="middle"
                    >
                      {e.w.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* nodes (HTML for crisp text) */}
          {NODES.map((n) => {
            const p = positions.get(n.id);
            if (!p) return null;
            const Icon = n.Icon;
            const color = GROUP_COLOR[n.group];
            const a = activations.get(n.id) ?? 0;
            const litByStep = mode !== "viz" && step >= n.layer;
            const intensity = mode === "viz" ? 0.7 : litByStep ? 0.3 + a * 0.7 : 0.2;
            const isSel = selected === n.id;
            const isHover = hover === n.id;
            return (
              <button
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected(n.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-left outline-none"
                style={{ left: p.x, top: p.y }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "relative grid h-12 w-12 place-items-center rounded-xl ring-1 transition-all duration-300",
                      isSel ? "ring-2" : "ring-1"
                    )}
                    style={{
                      background: `oklch(0.12 0.02 265 / 0.85)`,
                      borderColor: color,
                      boxShadow: `0 0 ${8 + intensity * 24}px ${color.replace(")", ` / ${intensity})`)}`,
                      // @ts-expect-error
                      "--tw-ring-color": color,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                    {/* activation ring */}
                    {mode !== "viz" && (
                      <svg className="absolute inset-0" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeDasharray={`${a * 138} 138`}
                          strokeLinecap="round"
                          transform="rotate(-90 24 24)"
                          style={{ transition: "stroke-dasharray 400ms ease" }}
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={cn(
                      "mt-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider transition-opacity",
                      isHover || isSel ? "opacity-100" : "opacity-60"
                    )}
                    style={{ color }}
                  >
                    {n.label}
                  </div>
                  {mode === "debug" && (
                    <div className="font-mono text-[9px] text-muted-foreground">
                      a={a.toFixed(2)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* legend */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              {(["input","value","skill","output"] as const).map((g) => (
                <span key={g} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: GROUP_COLOR[g], boxShadow: `0 0 8px ${GROUP_COLOR[g]}` }} />
                  {g}
                </span>
              ))}
            </div>
            <span>fwd-pass · {NODES.length} units · {edgeWeights.length} edges</span>
          </div>
        </div>

        {/* inspector */}
        <div className="rounded-3xl p-5 glass-panel gradient-border">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            inspector
          </div>
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <selectedNode.Icon className="h-4 w-4" style={{ color: GROUP_COLOR[selectedNode.group] }} />
                  <h3 className="font-display text-lg font-semibold">{selectedNode.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{selectedNode.sub}</p>
                <dl className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-wider">
                  <div className="rounded-md bg-black/30 p-2">
                    <dt className="text-muted-foreground">layer</dt>
                    <dd className="mt-1 text-foreground">L{selectedNode.layer}</dd>
                  </div>
                  <div className="rounded-md bg-black/30 p-2">
                    <dt className="text-muted-foreground">activation</dt>
                    <dd className="mt-1 text-foreground">{selectedNode.act}</dd>
                  </div>
                  <div className="rounded-md bg-black/30 p-2">
                    <dt className="text-muted-foreground">bias</dt>
                    <dd className="mt-1 text-foreground">{selectedNode.bias.toFixed(2)}</dd>
                  </div>
                  <div className="rounded-md bg-black/30 p-2">
                    <dt className="text-muted-foreground">a(x)</dt>
                    <dd className="mt-1 text-cyber-cyan">{(activations.get(selectedNode.id) ?? 0).toFixed(2)}</dd>
                  </div>
                </dl>

                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    incoming weights
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {edgeWeights.filter((e) => e.to === selectedNode.id).map((e) => {
                      const f = NODES.find((n) => n.id === e.from)!;
                      return (
                        <li key={e.from} className="flex items-center justify-between gap-3 font-mono text-[11px]">
                          <span className="text-muted-foreground">{f.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded-full bg-black/40">
                              <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet" style={{ width: `${e.w * 100}%` }} />
                            </div>
                            <span className="w-9 tabular-nums text-cyber-cyan">{e.w.toFixed(2)}</span>
                          </div>
                        </li>
                      );
                    })}
                    {edgeWeights.filter((e) => e.to === selectedNode.id).length === 0 && (
                      <li className="text-[11px] text-muted-foreground">— input layer —</li>
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
                className="mt-4 space-y-3 text-sm text-muted-foreground"
              >
                <p>Select any node to inspect its activation, bias, and incoming weights.</p>
                <ul className="space-y-2 font-mono text-[11px]">
                  <li><span className="text-cyber-cyan">visualize</span> — clean static graph.</li>
                  <li><span className="text-cyber-cyan">simulate</span> — pulse signals layer by layer.</li>
                  <li><span className="text-cyber-cyan">debug</span> — show numeric weights & activations.</li>
                </ul>
                <div className="rounded-md bg-black/30 p-3 font-mono text-[10px] text-muted-foreground">
                  <div className="text-cyber-cyan">model.summary()</div>
                  <div>params: {edgeWeights.length} weights · {NODES.length} units</div>
                  <div>arch: feedforward (4 layers)</div>
                  <div>loss: ego_decay = 0.0</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* short bio */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
        {[
          "I balance a heavy Communications & Electronics Engineering curriculum with self-directed offensive security work — eJPT certified, three #1 finishes on TryHackMe, and a Snapchat SMTP open relay disclosed responsibly.",
          "Hands-on across both worlds: Smart Recon Vehicle, Butterworth band-pass filters, the Shadow Core Framework, NM Analyzer, a Payload Research Toolkit, and a custom TCP scanner.",
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

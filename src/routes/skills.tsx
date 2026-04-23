import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import {
  Sword, ShieldCheck, Code2, Wrench, Cpu,
  Plus, Check, Layers, Crosshair, ArrowUpRight, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Mostafa Galal" },
      { name: "description", content: "Capability matrix — offensive security, networking, languages, tooling, and embedded systems Mostafa Galal works with." },
      { property: "og:title", content: "Skills — Mostafa Galal" },
      { property: "og:description", content: "Capability matrix — offensive security, networking, languages, tooling, and embedded systems." },
    ],
  }),
  component: SkillsPage,
});

type Capability = {
  id: string;
  name: string;
  category: string;
  CategoryIcon: typeof Sword;
  depth: number;          // proficiency 0..100
  experience: string;     // years / project count
  frequency: "daily" | "weekly" | "monthly" | "occasional";
  tools: string[];
  useCases: string[];
  notes: string;
};

const CAPABILITIES: Capability[] = [
  // Offensive
  { id: "pentest", name: "Penetration Testing", category: "Offensive", CategoryIcon: Sword, depth: 88, experience: "2y · 60+ boxes", frequency: "weekly",
    tools: ["Metasploit", "Burp Suite", "Nmap", "CrackMapExec", "Impacket"],
    useCases: ["Internal/external network engagements", "Web app assessments (OWASP Top 10)", "Active Directory exploitation"],
    notes: "eJPT certified. Methodology-driven — recon, enum, exploit, post-exploit, report." },
  { id: "webexp", name: "Web Exploitation", category: "Offensive", CategoryIcon: Sword, depth: 85, experience: "200+ challenges", frequency: "daily",
    tools: ["Burp Suite", "ffuf", "sqlmap", "Caido"],
    useCases: ["IDOR / business logic flaws", "SQLi / XSS / SSRF", "Auth bypass & session attacks"],
    notes: "Disclosed Snapchat SMTP open-relay responsibly." },
  { id: "exploitdev", name: "Exploit Development", category: "Offensive", CategoryIcon: Sword, depth: 72, experience: "lab projects", frequency: "monthly",
    tools: ["pwndbg", "GEF", "pwntools", "ROPgadget"],
    useCases: ["Stack BOFs", "Shellcode authoring", "CTF pwn challenges"],
    notes: "Custom buffer-overflow chains across CTF challenges." },
  { id: "redteam", name: "Red Team Methodology", category: "Offensive", CategoryIcon: Sword, depth: 80, experience: "AD labs", frequency: "weekly",
    tools: ["BloodHound", "Mimikatz", "Rubeus"],
    useCases: ["Adversary emulation", "Lateral movement", "Persistence / OPSEC"],
    notes: "Builds and breaks AD labs at home." },

  // Defensive / Networking
  { id: "netfund", name: "Network Fundamentals", category: "Networking", CategoryIcon: ShieldCheck, depth: 92, experience: "ITI 24h + uni", frequency: "daily",
    tools: ["Wireshark", "tcpdump", "Cisco IOS"],
    useCases: ["TCP/IP deep packet analysis", "Routing & switching design", "Subnetting / VLSM"],
    notes: "ITI Network Fundamentals certified." },
  { id: "advnet", name: "Advanced Networking", category: "Networking", CategoryIcon: ShieldCheck, depth: 85, experience: "ITI 24h", frequency: "weekly",
    tools: ["Cisco IOS", "GNS3", "Wireshark"],
    useCases: ["OSPF / EIGRP routing", "ACLs & NAT", "Inter-VLAN routing"],
    notes: "ITI Advanced Networking module completed." },
  { id: "linuxadmin", name: "Linux System Admin", category: "Networking", CategoryIcon: ShieldCheck, depth: 88, experience: "Red Hat aligned", frequency: "daily",
    tools: ["bash", "systemd", "iptables", "SELinux"],
    useCases: ["Hardening", "Service & user management", "Shell scripting"],
    notes: "RHCSA-aligned coursework." },

  // Languages
  { id: "python", name: "Python", category: "Languages", CategoryIcon: Code2, depth: 92, experience: "4y · daily", frequency: "daily",
    tools: ["requests", "scapy", "pwntools", "FastAPI"],
    useCases: ["Tooling & automation", "Custom scanners", "Exploit scripts"],
    notes: "Daily driver across security & automation work." },
  { id: "embc", name: "Embedded C/C++", category: "Languages", CategoryIcon: Code2, depth: 85, experience: "Smart Recon Vehicle", frequency: "monthly",
    tools: ["Arduino IDE", "PlatformIO", "AVR-GCC"],
    useCases: ["Motor drivers", "Serial / BT comms", "Sensor pipelines"],
    notes: "Built embedded Recon Vehicle stack." },
  { id: "bash", name: "Bash", category: "Languages", CategoryIcon: Code2, depth: 88, experience: "daily", frequency: "daily",
    tools: ["coreutils", "awk", "sed"],
    useCases: ["Linux automation", "Pipeline glue", "Recon orchestration"],
    notes: "Framework deployment scripts." },
  { id: "asm", name: "x86 Assembly", category: "Languages", CategoryIcon: Code2, depth: 65, experience: "RE practice", frequency: "monthly",
    tools: ["NASM", "GDB"],
    useCases: ["Reverse engineering", "Shellcode", "BOF exploit dev"],
    notes: "x86_64 fluent enough for RE & CTF pwn." },

  // Tooling
  { id: "metasploit", name: "Metasploit", category: "Tooling", CategoryIcon: Wrench, depth: 85, experience: "eJPT lab", frequency: "weekly",
    tools: ["msfconsole", "msfvenom"],
    useCases: ["Exploit framework", "Listener orchestration", "Post-ex modules"],
    notes: "Comfortable with full kill-chain in MSF." },
  { id: "nmap", name: "Nmap", category: "Tooling", CategoryIcon: Wrench, depth: 92, experience: "daily", frequency: "daily",
    tools: ["nmap", "ncat", "NSE"],
    useCases: ["Service enum", "OS detection", "Scriptable scans"],
    notes: "Custom NSE for niche enum tasks." },
  { id: "burp", name: "Burp Suite", category: "Tooling", CategoryIcon: Wrench, depth: 80, experience: "200+ apps", frequency: "weekly",
    tools: ["Burp", "Caido"],
    useCases: ["Intercept / replay", "Repeater / Intruder", "Session analysis"],
    notes: "Primary web testing workbench." },
  { id: "opencv", name: "OpenCV", category: "Tooling", CategoryIcon: Wrench, depth: 78, experience: "FaceBlur Live", frequency: "monthly",
    tools: ["OpenCV", "NumPy"],
    useCases: ["Real-time CV", "Face detection", "Image pipelines"],
    notes: "Built FaceBlur Live for real-time anonymization." },

  // Embedded / Electronics
  { id: "filters", name: "Analog Filter Design", category: "Embedded", CategoryIcon: Cpu, depth: 88, experience: "uni + projects", frequency: "monthly",
    tools: ["LTspice", "MATLAB"],
    useCases: ["RLC band-pass", "Butterworth 3rd-order", "Frequency shaping"],
    notes: "Designed and validated multiple BPFs." },
  { id: "logic", name: "Digital Logic Design", category: "Embedded", CategoryIcon: Cpu, depth: 85, experience: "Smart Curtain", frequency: "occasional",
    tools: ["Logisim", "Quartus"],
    useCases: ["Combinational / sequential logic", "Automation systems", "Hardware decision logic"],
    notes: "Smart Curtain System uses pure gate logic." },
  { id: "freq", name: "Frequency Response Analysis", category: "Embedded", CategoryIcon: Cpu, depth: 82, experience: "uni labs", frequency: "monthly",
    tools: ["MATLAB", "Octave", "LTspice"],
    useCases: ["Resonance / bandwidth", "Q-factor", "Transfer functions"],
    notes: "Foundation for all my analog work." },
  { id: "bt", name: "Bluetooth / HC-05", category: "Embedded", CategoryIcon: Cpu, depth: 80, experience: "Recon Vehicle", frequency: "occasional",
    tools: ["HC-05", "AT cmds"],
    useCases: ["Wireless control", "Embedded comms", "Sensor relay"],
    notes: "Wireless control for embedded vehicle." },
];

const CATEGORIES = Array.from(new Set(CAPABILITIES.map((c) => c.category)));
const CATEGORY_ICON: Record<string, typeof Sword> = {
  Offensive: Sword,
  Networking: ShieldCheck,
  Languages: Code2,
  Tooling: Wrench,
  Embedded: Cpu,
};

const FREQ_LABEL: Record<Capability["frequency"], string> = {
  daily: "Daily use",
  weekly: "Weekly use",
  monthly: "Monthly use",
  occasional: "Occasional",
};

type Mode = "analysis" | "loadout";

function SkillsPage() {
  const [mode, setMode] = useState<Mode>("analysis");
  const [activeCat, setActiveCat] = useState<string>("Offensive");
  const [selectedId, setSelectedId] = useState<string>(CAPABILITIES[0].id);
  const [loadout, setLoadout] = useState<Set<string>>(new Set(["pentest", "webexp", "python", "nmap", "burp"]));

  const filtered = useMemo(
    () => CAPABILITIES.filter((c) => c.category === activeCat),
    [activeCat]
  );
  const selected = CAPABILITIES.find((c) => c.id === selectedId)!;

  const toggleSlot = (id: string) => {
    setLoadout((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 6) next.add(id);
      return next;
    });
  };

  const avgDepth = useMemo(() => {
    if (loadout.size === 0) return 0;
    const ids = Array.from(loadout);
    const sum = ids.reduce((s, id) => s + (CAPABILITIES.find((c) => c.id === id)?.depth ?? 0), 0);
    return Math.round(sum / loadout.size);
  }, [loadout]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-cyber-cyan to-transparent" />
            capability::matrix
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Cyber-ops <span className="text-gradient-cyber">capability matrix</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Each capability is a module with proven tools, real use-cases, and measured depth.
            Switch to <span className="text-foreground">loadout</span> mode to assemble the right kit for an engagement.
          </p>
        </div>
      </Reveal>

      {/* mode + status bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 glass-panel gradient-border">
        <div className="flex items-center gap-1">
          {(["analysis","loadout"] as const).map((m) => {
            const Icon = m === "analysis" ? Crosshair : Layers;
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
                {m} mode
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>capabilities: <span className="text-foreground">{CAPABILITIES.length}</span></span>
          <span>categories: <span className="text-foreground">{CATEGORIES.length}</span></span>
          {mode === "loadout" && (
            <>
              <span>slots: <span className="text-cyber-cyan">{loadout.size}/6</span></span>
              <span>avg depth: <span className="text-cyber-cyan">{avgDepth}</span></span>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr_320px]">
        {/* left rail — categories */}
        <aside className="rounded-2xl p-3 glass-panel gradient-border">
          <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            modules
          </div>
          <ul className="space-y-1">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICON[cat] ?? Sword;
              const count = CAPABILITIES.filter((c) => c.category === cat).length;
              const active = activeCat === cat;
              return (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setActiveCat(cat);
                      const first = CAPABILITIES.find((c) => c.category === cat);
                      if (first) setSelectedId(first.id);
                    }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-all",
                      active ? "bg-cyber-cyan/10 text-foreground" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={cn("h-3.5 w-3.5", active ? "text-cyber-cyan" : "")} />
                      <span className="font-mono text-xs uppercase tracking-wider">{cat}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/70">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* center — capability list */}
        <section className="rounded-2xl p-4 glass-panel gradient-border">
          <div className="flex items-center justify-between pb-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              {activeCat} · capabilities
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              click to inspect
            </div>
          </div>
          <ul className="space-y-2">
            {filtered.map((c) => {
              const isSel = selectedId === c.id;
              const inLoadout = loadout.has(c.id);
              return (
                <li key={c.id}>
                  <div
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg border bg-black/20 p-3 transition-all",
                      isSel ? "border-cyber-cyan/50 bg-cyber-cyan/[0.04] shadow-[0_0_24px_oklch(0.85_0.18_200/0.15)]" : "border-border/60 hover:border-border"
                    )}
                  >
                    <button onClick={() => setSelectedId(c.id)} className="flex flex-1 items-center gap-3 text-left">
                      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md bg-black/40 ring-1 ring-border">
                        <c.CategoryIcon className={cn("h-4 w-4", isSel ? "text-cyber-cyan" : "text-muted-foreground")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-display text-sm font-medium">{c.name}</span>
                          {inLoadout && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-cyber-violet">
                              · loadout
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          <span>{c.experience}</span>
                          <span className="inline-flex items-center gap-1">
                            <Activity className="h-2.5 w-2.5" />
                            {c.frequency}
                          </span>
                        </div>
                      </div>
                      {/* depth meter */}
                      <div className="hidden w-32 sm:block">
                        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          <span>depth</span>
                          <span className="text-cyber-cyan">{c.depth}</span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/40">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
                            initial={{ width: 0 }}
                            animate={{ width: `${c.depth}%` }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    </button>

                    {mode === "loadout" && (
                      <button
                        onClick={() => toggleSlot(c.id)}
                        title={inLoadout ? "Remove from loadout" : "Add to loadout"}
                        className={cn(
                          "grid h-8 w-8 place-items-center rounded-md transition-all",
                          inLoadout
                            ? "bg-cyber-violet/15 text-cyber-violet ring-1 ring-cyber-violet/40"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        {inLoadout ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* right — detail panel */}
        <aside className="rounded-2xl p-5 glass-panel gradient-border">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            module · detail
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{selected.name}</h3>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {selected.category}
                  </p>
                </div>
                <span className="font-mono text-2xl font-bold text-gradient-cyber tabular-nums">
                  {selected.depth}
                </span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
                  initial={{ width: 0 }}
                  animate={{ width: `${selected.depth}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-wider">
                <div className="rounded-md bg-black/30 p-2">
                  <dt className="text-muted-foreground">experience</dt>
                  <dd className="mt-1 text-foreground">{selected.experience}</dd>
                </div>
                <div className="rounded-md bg-black/30 p-2">
                  <dt className="text-muted-foreground">cadence</dt>
                  <dd className="mt-1 text-foreground">{FREQ_LABEL[selected.frequency]}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  primary tools
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-cyber-cyan/30 bg-cyber-cyan/5 px-2 py-0.5 font-mono text-[10px] text-cyber-cyan"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  use-cases
                </div>
                <ul className="mt-2 space-y-1.5">
                  {selected.useCases.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-xs text-foreground/85">
                      <ArrowUpRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-cyber-violet" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 border-t border-border/60 pt-3 text-xs italic text-muted-foreground">
                {selected.notes}
              </p>

              {mode === "loadout" && (
                <button
                  onClick={() => toggleSlot(selected.id)}
                  className={cn(
                    "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-all",
                    loadout.has(selected.id)
                      ? "bg-cyber-violet/15 text-cyber-violet ring-1 ring-cyber-violet/40"
                      : "bg-cyber-cyan/15 text-cyber-cyan ring-1 ring-cyber-cyan/40"
                  )}
                >
                  {loadout.has(selected.id) ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {loadout.has(selected.id) ? "in loadout" : "add to loadout"}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      {/* loadout summary */}
      {mode === "loadout" && loadout.size > 0 && (
        <div className="mt-6 rounded-2xl p-5 glass-panel gradient-border">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-violet">
              active loadout
            </div>
            <button
              onClick={() => setLoadout(new Set())}
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              clear
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(loadout).map((id) => {
              const cap = CAPABILITIES.find((c) => c.id === id)!;
              return (
                <div key={id} className="flex items-center gap-2 rounded-md bg-black/30 p-2 ring-1 ring-cyber-violet/20">
                  <cap.CategoryIcon className="h-3.5 w-3.5 text-cyber-violet" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs">{cap.name}</div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      depth {cap.depth} · {cap.frequency}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Sword, ShieldCheck, Code2, Wrench, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Mostafa Galal" },
      {
        name: "description",
        content:
          "The arsenal — offensive security, networking, languages, tooling, and embedded systems Mostafa Galal works with.",
      },
      { property: "og:title", content: "Skills — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "The arsenal — offensive security, networking, languages, tooling, and embedded systems.",
      },
    ],
  }),
  component: SkillsPage,
});

type Skill = { name: string; level: number; note: string };
type Category = { Icon: typeof Sword; key: string; title: string; skills: Skill[] };

const CATEGORIES: Category[] = [
  {
    key: "offensive",
    Icon: Sword,
    title: "Offensive Security",
    skills: [
      { name: "Penetration Testing", level: 88, note: "eJPT certified — methodology, recon, exploitation, reporting." },
      { name: "Web Exploitation", level: 85, note: "OWASP Top 10, business logic, real-world bug bounty findings." },
      { name: "Network Reconnaissance", level: 90, note: "Nmap, Subfinder, httpx, custom TCP scanners." },
      { name: "Exploit Development", level: 72, note: "Stack-based buffer overflows, shellcode fundamentals." },
      { name: "Reverse Engineering", level: 70, note: "x86 assembly, ELF analysis, symbol-table heuristics." },
      { name: "Red Team Methodology", level: 80, note: "Adversary emulation, AD labs, post-exploitation." },
    ],
  },
  {
    key: "defensive",
    Icon: ShieldCheck,
    title: "Networking & Defense",
    skills: [
      { name: "Network Fundamentals", level: 92, note: "TCP/IP, routing, switching — 24h ITI training." },
      { name: "Advanced Networking", level: 85, note: "ITI advanced networking module (24h)." },
      { name: "Linux System Admin", level: 88, note: "Red Hat RHCSA-aligned coursework." },
      { name: "Cybersecurity Fundamentals", level: 90, note: "Mahara-Tech / VMware 35h foundational program." },
    ],
  },
  {
    key: "languages",
    Icon: Code2,
    title: "Languages",
    skills: [
      { name: "Python", level: 92, note: "Daily driver — tooling, automation, scanners, ML pipelines." },
      { name: "Embedded C/C++", level: 85, note: "Smart Recon Vehicle, motor drivers, serial comms." },
      { name: "JavaScript", level: 75, note: "Payload research, web exploitation context." },
      { name: "Bash", level: 88, note: "Linux automation, framework deployment scripts." },
      { name: "x86 Assembly", level: 65, note: "Reverse engineering, BOF exploit development." },
    ],
  },
  {
    key: "tooling",
    Icon: Wrench,
    title: "Tooling",
    skills: [
      { name: "Metasploit", level: 85, note: "Exploitation framework — eJPT lab work." },
      { name: "Nmap", level: 92, note: "Service enumeration, OS detection, NSE scripts." },
      { name: "Burp Suite", level: 80, note: "Web app testing, intercept, repeater workflows." },
      { name: "OpenCV", level: 78, note: "Real-time computer vision (FaceBlur Live)." },
      { name: "Subfinder / httpx / swaks", level: 88, note: "Recon and SMTP testing — Snapchat finding." },
    ],
  },
  {
    key: "embedded",
    Icon: Cpu,
    title: "Embedded & Electronics",
    skills: [
      { name: "Analog Filter Design", level: 88, note: "RLC band-pass, 3rd-order Butterworth filters." },
      { name: "Digital Logic Design", level: 85, note: "Logic gates, automation systems (Smart Curtain)." },
      { name: "Frequency Response Analysis", level: 82, note: "Resonance, bandwidth, Q-factor, transfer functions." },
      { name: "Bluetooth / HC-05", level: 80, note: "Wireless control for embedded vehicles." },
      { name: "Circuit Simulation", level: 78, note: "Filter design and validation workflows." },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function WeaponMount({ skill, idx }: { skill: Skill; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: idx * 0.04 }}
      className="group relative"
    >
      {/* hook / mount */}
      <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-gradient-to-b from-cyber-cyan/60 to-transparent" />
      <div className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyber-cyan/70 shadow-[0_0_10px_oklch(0.85_0.18_200/0.8)]" />

      <div
        className="relative mt-5 overflow-hidden rounded-xl p-4 glass-panel gradient-border corner-brackets transition-all duration-300 group-hover:-translate-y-1"
        style={{
          boxShadow: "inset 0 0 30px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* spotlight on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "oklch(0.85 0.18 200 / 0.45)" }}
        />

        <div className="flex items-start justify-between">
          <h3 className="font-display text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-cyber-cyan">
            {skill.name}
          </h3>
          <span className="ml-2 font-mono text-[10px] tabular-nums text-cyber-cyan">
            {skill.level}
          </span>
        </div>

        {/* level bar like a gauge */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-black/50 ring-1 ring-cyber-cyan/20">
          <motion.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: skill.level / 100 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.1 + idx * 0.03 }}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/85">
          {skill.note}
        </p>

        {/* serial tag */}
        <div className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
          SN-{(idx + 1).toString().padStart(3, "0")}
        </div>
      </div>
    </motion.div>
  );
}

function SkillsPage() {
  const [active, setActive] = useState<string>(CATEGORIES[0].key);
  const cat = CATEGORIES.find((c) => c.key === active)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-cyber-cyan to-transparent" />
            arsenal::wall
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            The <span className="text-gradient-cyber">arsenal</span> on the wall
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Each tool mounted, tagged, and ready. Pick a category — hover any tool to light it up.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, Icon, title }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider glass-panel gradient-border transition-all",
                isActive
                  ? "text-cyber-cyan shadow-[0_0_24px_oklch(0.85_0.18_200/0.35)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {title}
              {isActive && <span className="ml-1 h-1 w-1 rounded-full bg-cyber-cyan" />}
            </button>
          );
        })}
      </div>

      {/* the wall */}
      <div
        className="relative mt-12 overflow-hidden rounded-3xl p-6 sm:p-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.02 265) 0%, oklch(0.09 0.015 265) 100%)",
          boxShadow:
            "inset 0 30px 60px oklch(0 0 0 / 0.5), inset 0 -30px 60px oklch(0 0 0 / 0.4)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* horizontal mount rails */}
        <div className="pointer-events-none absolute inset-x-6 top-3 h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-cyber-violet/30 to-transparent" />

        {/* faint planks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 80px, oklch(1 0 0 / 0.02) 80px 81px)",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {cat.skills.map((s, i) => (
              <WeaponMount key={s.name} skill={s} idx={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
